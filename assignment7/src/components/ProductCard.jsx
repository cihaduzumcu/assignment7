import { Link } from "react-router";
import { useCartStore } from "../store/cartStore.js";

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} />
        <h3>{product.title}</h3>
      </Link>
      <p>{product.category}</p>
      <p>
        <strong>${product.price.toFixed(2)}</strong>
      </p>
      <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>
    </article>
  );
}

export default ProductCard;
