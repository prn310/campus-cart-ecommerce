import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ cartCount }) {
    return (
        <header className="topbar">
            <Link className="brand" to="/" aria-label="Campus Cart home">
                <span className="brand-mark">C</span>
                <span>campus<span className="brand-light">cart</span></span>
            </Link>
            <nav aria-label="Main navigation">
                <Link to="/">Shop</Link>
                <Link
                    className="cart-pill"
                    to="/checkout"
                    aria-label={'Bag, ' + cartCount + ' items'}
                >
                    Bag <b>{cartCount}</b>
                </Link>
            </nav>
        </header>
    );
}
