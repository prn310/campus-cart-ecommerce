import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';

const PRODUCTS_URL = 'https://fakestoreapi.com/products';

const CartContext = createContext(null);

function getSavedCart() {
    try {
        const savedCart = localStorage.getItem('campus-cart');
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
        return [];
    }
}

function cartReducer(cart, action) {
    switch (action.type) {
        case 'add': {
            const quantity = Math.max(1, Number(action.quantity) || 1);
            const existingItem = cart.find((item) => item.id === action.product.id);
            if (existingItem) {
                return cart.map((item) =>
                    item.id === action.product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                );
            }
            return [...cart, { ...action.product, quantity }];
        }
        case 'update':
            return cart.map((item) =>
                item.id === action.id
                    ? { ...item, quantity: Math.max(1, Number(action.quantity) || 1) }
                    : item,
            );
        case 'remove':
            return cart.filter((item) => item.id !== action.id);
        case 'clear':
            return [];
        default:
            return cart;
    }
}

function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, undefined, getSavedCart);

    useEffect(() => {
        try {
            localStorage.setItem('campus-cart', JSON.stringify(cart));
        } catch {
            // The cart still works if browser storage is unavailable.
        }
    }, [cart]);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const addItem = (product, quantity = 1) =>
        dispatch({ type: 'add', product, quantity });
    const updateQuantity = (id, quantity) =>
        dispatch({ type: 'update', id, quantity });
    const removeItem = (id) => dispatch({ type: 'remove', id });
    const clearCart = () => dispatch({ type: 'clear' });

    return (
        <CartContext.Provider
            value={{ cart, cartCount, addItem, updateQuantity, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

function useCart() {
    const cartContext = useContext(CartContext);
    if (!cartContext) {
        throw new Error('useCart must be used inside CartProvider.');
    }
    return cartContext;
}


function ProductList({ onAdd }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch(PRODUCTS_URL);
                if (!response.ok) throw new Error('Could not load products.');
                setProducts(await response.json());
            } catch {
                setError('Could not load products. Check your internet connection.');
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    return (
        <main className="page-shell">
            <section className="hero">
                <p className="eyebrow">THE EVERYDAY EDIT</p>
                <h1>Good things.<br /><span>Good prices.</span></h1>
                <p className="hero-note">A few little finds to make your day better.</p>
            </section>
            <section className="catalog">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">A LITTLE OF EVERYTHING</p>
                        <h2>The collection</h2>
                    </div>
                    {!loading && !error && <span className="item-count">{products.length} good finds</span>}
                </div>
                {loading && <p className="status-message">Loading products…</p>}
                {error && <p className="status-message error-message">{error}</p>}
                {!loading && !error && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onAdd={onAdd} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function ProductDetails({ onAdd }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function loadProduct() {
            try {
                const response = await fetch(PRODUCTS_URL + '/' + id);
                if (!response.ok) throw new Error('Product not found.');
                setProduct(await response.json());
            } catch {
                setError('Could not find this product.');
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    if (loading) return <main className="detail-shell">Loading product…</main>;
    if (error) {
        return (
            <main className="detail-shell">
                <p>{error}</p>
                <Link className="back-link" to="/">← Back to shop</Link>
            </main>
        );
    }

    return (
        <main className="detail-shell">
            <Link className="back-link" to="/">← Back to shop</Link>
            <section className="detail-card">
                <div className="detail-image"><img src={product.image} alt={product.title} /></div>
                <div className="detail-copy">
                    <p className="eyebrow">{product.category}</p>
                    <h1>{product.title}</h1>
                    <p className="detail-description">{product.description}</p>
                    <div className="quantity-control">
                        <label htmlFor="product-quantity">Quantity</label>
                        <input
                            id="product-quantity"
                            type="number"
                            min="1"
                            max="99"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))
                            }
                        />
                    </div>
                    <div className="detail-actions">
                        <span className="price">{'$' + product.price.toFixed(2)}</span>
                        <button className="primary-button" onClick={() => onAdd(product, quantity)}>Add to bag</button>
                    </div>
                </div>
            </section>
        </main>
    );
}

function CheckoutPage({ cart, onPlaceOrder, onUpdateQuantity, onRemoveItem }) {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 5;
    const total = subtotal + shipping;

    function handleSubmit(event) {
        event.preventDefault();
        onPlaceOrder();
        setOrderPlaced(true);
    }

    if (orderPlaced) {
        return (
            <main className="checkout-shell">
                <section className="order-success">
                    <p className="eyebrow">ORDER CONFIRMED</p>
                    <h1>Thank you for your order!</h1>
                    <p>This is a demo checkout. No payment was processed.</p>
                    <Link className="primary-button" to="/">Continue shopping</Link>
                </section>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="checkout-shell">
                <section className="empty-cart">
                    <h1>Your bag is empty</h1>
                    <p>Add something from the shop before checking out.</p>
                    <Link className="primary-button" to="/">Go to shop</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="checkout-shell">
            <Link className="back-link" to="/">← Continue shopping</Link>
            <div className="checkout-heading">
                <p className="eyebrow">ALMOST YOURS</p>
                <h1>Checkout</h1>
            </div>

            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <section className="checkout-section">
                        <h2>Shipping information</h2>
                        <label>Full name<input name="fullName" type="text" autoComplete="name" required /></label>
                        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                        <label>Street address<input name="address" type="text" autoComplete="street-address" required /></label>
                        <div className="form-row">
                            <label>City<input name="city" type="text" autoComplete="address-level2" required /></label>
                            <label>Postal code<input name="postalCode" type="text" autoComplete="postal-code" required /></label>
                        </div>
                    </section>

                    <section className="checkout-section">
                        <h2>Payment option</h2>
                        <label className="payment-option">
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(event) => setPaymentMethod(event.target.value)} />
                            Credit or debit card
                        </label>
                        <label className="payment-option">
                            <input type="radio" name="payment" value="delivery" checked={paymentMethod === 'delivery'} onChange={(event) => setPaymentMethod(event.target.value)} />
                            Cash on delivery
                        </label>
                        <p className="demo-note">Demo checkout only. No card details are collected and no payment is processed.</p>
                    </section>

                    <button className="primary-button place-order-button" type="submit">
                        Place order · {'$' + total.toFixed(2)}
                    </button>
                </form>

                <aside className="order-summary">
                    <h2>Order summary</h2>
                    <div className="summary-items">
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemoveItem={onRemoveItem}
                            />
                        ))}
                    </div>
                    <div className="summary-line"><span>Subtotal</span><span>{'$' + subtotal.toFixed(2)}</span></div>
                    <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
                    <p className="shipping-note">Free shipping on orders of $50 or more.</p>
                    <div className="summary-total"><span>Total</span><strong>{'$' + total.toFixed(2)}</strong></div>
                </aside>
            </div>
        </main>
    );
}

function AppContent() {
    const {
        cart,
        cartCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart();

    return (
        <>
            <Navbar cartCount={cartCount} />
            <Routes>
                <Route path="/" element={<ProductList onAdd={addItem} />} />
                <Route
                    path="/products/:id"
                    element={<ProductDetails onAdd={addItem} />}
                />
                <Route
                    path="/checkout"
                    element={
                        <CheckoutPage
                            cart={cart}
                            onPlaceOrder={clearCart}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeItem}
                        />
                    }
                />
                <Route
                    path="*"
                    element={
                        <main className="detail-shell">
                            <h1>Page not found</h1>
                            <Link className="back-link" to="/">Back to shop</Link>
                        </main>
                    }
                />
            </Routes>
            <footer className="footer">
                <span>campus<span className="brand-light">cart</span></span>
                <span>Good finds for everyday life.</span>
            </footer>
        </>
    );
}

export default function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}
