import { create } from "zustand";

const STORAGE_KEY = "cart-items";

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function loadItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: loadItems(),

  addItem: (product) =>
    set((state) => {
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      const newItem = { id: product.id, title: product.title, price: product.price, quantity: 1 };
      return { items: [...state.items, newItem] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return {
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      };
    }),

  clear: () => set({ items: [] }),
}));

useCartStore.subscribe((state, prevState) => {
  if (state.items === prevState.items) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
  }
});

export const selectItemCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
