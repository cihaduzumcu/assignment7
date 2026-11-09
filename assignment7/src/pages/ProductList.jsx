import { useSearchParams } from "react-router";
import { fetchProducts } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const { loading, error, data: products } = useFetch(fetchProducts, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  }

  if (loading) {
    return <p className="status">Loading products...</p>;
  }

  if (error) {
    return <p className="status error">Could not load products: {error.message}</p>;
  }

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const search = query.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      (category === "" || product.category === category) &&
      product.title.toLowerCase().includes(search)
  );

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title"
          aria-label="Search by title"
          value={query}
          onChange={(event) => updateParam("q", event.target.value)}
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => updateParam("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="status">No products match your filters.</p>
      ) : (
        <div className="grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
