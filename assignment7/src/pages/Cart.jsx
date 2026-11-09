import { Link } from "react-router";
import { selectTotalPrice, useCartStore } from "../store/cartStore.js";

function Cart() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div className="quantity">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.title}`}
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.title}`}
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <strong>Total: ${totalPrice.toFixed(2)}</strong>
      </p>
      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  );
}

export default Cart;
