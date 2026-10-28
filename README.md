# Campus Cart

Campus Cart is a beginner-friendly React e-commerce demo built with Vite. It brings the product listing, product details, shared shopping cart, and checkout assignments together in one app.

## Features

- Fetches product information and images from the Fake Store API.
- Uses React Router for the shop, product details, checkout, and not-found pages.
- Lets shoppers choose a product quantity and add items to the cart.
- Shares cart state with the React Context API and reducer across all routes.
- Saves the cart in browser local storage.
- Includes shipping information, an order summary, and demo payment choices at checkout.

Checkout is for demonstration only. It does not collect card details or process payments.

## Run the app

1. Install Node.js.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local address printed in the terminal.

## Build

Run `npm run build` to create the production files in `dist/`.

## Main files

- `src/App.jsx` contains the cart context and page routes.
- `src/components/Navbar.jsx` contains the shared navigation bar.
- `src/components/ProductCard.jsx` displays a product in the shop.
- `src/components/CartItem.jsx` displays and updates a cart item.
- `src/styles.css` contains the app styles.
