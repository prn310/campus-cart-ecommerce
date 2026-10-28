import React from 'react';
export default function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
    return (
        <div className="summary-item">
            <img src={item.image} alt="" />
            <div className="summary-item-copy">
                <p>{item.title}</p>
                <div className="summary-item-controls">
                    <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={'Decrease quantity of ' + item.title}
                    >
                        −
                    </button>
                    <span>Qty: {item.quantity}</span>
                    <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={'Increase quantity of ' + item.title}
                    >
                        +
                    </button>
                    <button
                        className="remove-item-button"
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                    >
                        Remove
                    </button>
                </div>
            </div>
            <strong>{'$' + (item.price * item.quantity).toFixed(2)}</strong>
        </div>
    );
}

