import { Link } from "react-router";

function ProductCard({ product }) {
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
    </article>
  );
}

export default ProductCard;
