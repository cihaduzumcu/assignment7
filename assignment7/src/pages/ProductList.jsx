import { fetchProducts } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const { loading, error, data: products } = useFetch(fetchProducts, []);

  if (loading) {
    return <p className="status">Loading products...</p>;
  }

  if (error) {
    return <p className="status error">Could not load products: {error.message}</p>;
  }

  if (products.length === 0) {
    return <p className="status">There are no products to show.</p>;
  }

  return (
    <section>
      <h1>Products</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
