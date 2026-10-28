import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
    return (
        <article className="product-card">
            <Link className="product-link" to={'/products/' + product.id}>
                <div className="image-wrap">
                    <img src={product.image} alt={product.title} loading="lazy" />
                </div>
                <div className="card-copy">
                    <p className="category">{product.category}</p>
                    <h2>{product.title}</h2>
                </div>
            </Link>
            <div className="card-bottom">
                <span className="price">{'$' + product.price.toFixed(2)}</span>
                <button
                    className="add-button"
                    onClick={() => onAdd(product)}
                    aria-label={'Add ' + product.title + ' to bag'}
                >
                    + Add
                </button>
            </div>
        </article>
    );
}
