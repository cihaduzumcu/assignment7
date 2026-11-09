import { Link, useNavigate, useParams } from "react-router";
import { fetchProduct } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import { useCartStore } from "../store/cartStore.js";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { loading, error, data: product } = useFetch(
    (signal) => fetchProduct(id, signal),
    [id]
  );

  const goBack = () => navigate("/products");

  if (loading) {
    return <p className="status">Loading product...</p>;
  }

  if (error) {
    const notFound = error.status === 404 || error.status === 400;
    return (
      <section className="status">
        <p className="error">
          {notFound
            ? `Product not found: there is no product with id "${id}".`
            : `Could not load the product: ${error.message}`}
        </p>
        <button type="button" onClick={goBack}>
          Back to products
        </button>
      </section>
    );
  }

  const nextId = Number(id) + 1;

  return (
    <section>
      <div className="detail">
        <img src={product.thumbnail} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p>Category: {product.category}</p>
          <p>
            <strong>${product.price.toFixed(2)}</strong>
          </p>
          <div className="detail-actions">
            <button type="button" onClick={() => addItem(product)}>
              Add to cart
            </button>
            <button type="button" onClick={goBack}>
              Back to products
            </button>
            <Link to={`/products/${nextId}`}>Next product →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
