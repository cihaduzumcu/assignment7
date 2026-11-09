Assignment 7 – Online Shop (React Router, Context, Zustand)

A small multi-page online shop built with React and Vite. Products come from the public DummyJSON API.

How to run:
    npm install
    npm run dev


Demo account: username demo@st.biruni.edu.tr, password demo123456.

File Organization:
- productsApi.js: fetchProducts / fetchProduct (fetch + AbortSignal, HTTP errors)
- authApi.js: simulated login (resolves after ~500 ms)
- useFetch.js: loading / error / data with useReducer, cancels requests
- useLocalStorage.js: useState-like hook that saves to localStorage
- AuthContext.jsx: AuthProvider + useAuth (Context + useReducer)
- cartStore.js: Zustand cart store, persisted with subscribe()
- Layout.jsx: navbar + <Outlet /> + footer, applies the theme class
- NavBar.jsx: NavLinks, cart count, theme toggle, login/logout
- ProductCard.jsx: one product in the grid
- ProtectedRoute.jsx: redirects to /login when nobody is signed in
- ProductList.jsx: filters stored in the query string
- ProductDetail.jsx: reads :id, handles "product not found"
- Cart.jsx: protected page
- App.jsx: route configuration
- main.jsx: BrowserRouter + AuthProvider



1. State choices
- Signed-in user: in AuthContext (Context + useReducer). Many distant components need it (NavBar, ProtectedRoute, Login), but it changes rarely, so Context is enough.
- Cart: in a Zustand store (cartStore.js). It changes often and is read by many components; with selectors each component re-renders only for the part it uses.
- Filter values: in the URL query string (useSearchParams). This way the filtered view can be shared as a link and survives a refresh.
- Product list: local state of ProductList through useFetch. Only this page needs it, so it does not need to be global.
- Theme: useLocalStorage in Layout, so it is saved between visits and applied as a class on the wrapper element.

2. Context versus store

The user changes only on login and logout, and every consumer of the Context re-renders when it changes, which is acceptable for such rare updates. The cart changes on every "Add to cart" or quantity click. If the cart were in Context, every component using that Context would re-render on each change, because Context has no selectors. If the user were in Zustand it would still work, but it would add an external library for state that React already handles well with Context.

3. Custom hooks

useFetch shares the logic: the loading/error/data reducer, the AbortController and the cleanup that cancels a request when the inputs change or the component unmounts. It does not share state: every component that calls it gets its own independent useReducer state, so ProductList and ProductDetail never see each other's data.

4. Route parameters

useParams() always returns strings, so id is "3", not 3. It mattered in ProductDetail when computing the "Next product" link: "3" + 1 would give "31", so I used Number(id) + 1. The cart uses the numeric product.id from the API response, not the URL string.

5. Protected routes

ProtectedRoute only hides a page in the browser. The code and data are still downloaded, and anyone can change the client state with the developer tools. Real security needs a server: the server must check a session or token on every request and refuse to return protected data to users who are not authenticated.

6. Deep links

A plain static file server looks for a file at /products/3, does not find one and returns 404, because the route only exists inside the JavaScript router. The Vite development server falls back to index.html for unknown paths, so React Router loads and shows the correct page. For production the server must be configured to serve index.html for all routes (a "SPA fallback" or rewrite rule).


Self-study notes:

- Updating one query parameter without losing the others: setSearchParams accepts a function that receives the current params. I copy them with new URLSearchParams(prev), then set or delete only one key. I pass { replace: true } so typing in the search box does not create a history entry for every key press.
- Initialising the store from localStorage safely: reading is wrapped in try/catch because JSON.parse throws on corrupted data. I also check that the result is an array and that each item has the expected fields; otherwise the cart starts empty. Saving uses useCartStore.subscribe((state, prevState) => …) outside React and writes only when items changed.
- Light/dark theme: colours are CSS custom properties (--bg, --text, …). The wrapper element gets the class theme-light or theme-dark, and each class defines a different set of values, so every component updates automatically.


Challenges:

- String route parameter: useParams() returns the id as a string, so my first "Next product" link went to /products/31 instead of /products/4. I fixed it with Number(id) + 1.
- fetch does not fail on 404: /products/999999 did not throw an error at first, so the detail page tried to show an empty product. I learned that fetch only rejects on network errors and added a response.ok check that throws.
- Requests in Strict Mode: In development, React runs effects twice, so I saw two requests in the Network tab. Aborting the request in the cleanup function and ignoring AbortError fixed the duplicate updates.
- Keeping other filters in the URL: When I changed the category, the search text disappeared from the URL. Using the function form of setSearchParams and copying the old params solved it.
- Avoiding extra re-renders: At first the navbar read the whole cart store. Selecting only the item count as a number made it re-render only when the count changes.
- Corrupted localStorage data: When I edited the saved cart by hand, JSON.parse crashed the app. I wrapped reading in try/catch and validated each item, so the cart starts empty instead.
- Redirect after login: Passing the original location from ProtectedRoute through navigation state, and using replace: true, took some trial and error so the login page would not stay in the browser history.