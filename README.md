# Bluebell — Electronics Store

## Overview

Bluebell is an electronics ecommerce project inspired by Bluebell in Bahrain. Customers will be able to browse products, view product details, and place orders. Store administrators will manage the product catalogue with full create, read, update, and delete (CRUD) functionality.

The application uses Node.js, Express, EJS, and MongoDB, with HTML, CSS, and JavaScript for a responsive storefront. Prices will be displayed in Bahraini dinars (BHD).

This README describes the project plan. The current code includes a homepage and basic registration, sign-in, and sign-out routes. Product management, orders, and final styling are planned work.

## Screenshots

Storefront screenshots will be added when the interface is implemented. The approved ERD appears under Database Design below.

## Technologies Used

- **Node.js and Express:** Server and application routes.
- **EJS:** Server-rendered templates and reusable partials.
- **HTML, CSS, and JavaScript:** Page structure, responsive styling, and browser interactions.
- **MongoDB and Mongoose:** Database storage and models.
- **bcrypt:** Password hashing.
- **express-session and connect-mongo:** Sessions stored in MongoDB.
- **method-override:** Update and delete requests from HTML forms.
- **dotenv:** Environment variable configuration.
- **Morgan:** HTTP request logging.

## Getting Started

### Prerequisites

- Node.js and npm.
- A local MongoDB instance or MongoDB Atlas connection string.

### Local Setup

1. Clone this repository and open its directory in your terminal.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/bluebell
   SESSION_SECRET=replace-with-a-long-random-secret
   PORT=3000
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Visit [http://localhost:3000](http://localhost:3000).

The `npm run dev` command supports automatic restarts if nodemon is installed in your development environment. Automated tests are not currently configured.

## User Stories

1. As a visitor, I want to create an account so that I can place orders.
2. As a registered user, I want to sign in and sign out so that I can access my account securely.
3. As a customer, I want to browse products by category and view their details so that I can find suitable electronics.
4. As a customer, I want to select products and provide my phone number and delivery address so that I can place an order.
5. As a customer, I want to view my previous orders and their status so that I can keep track of my purchases.
6. As a store administrator, I want to create product listings so that customers can discover new products.
7. As a store administrator, I want to update product information, prices, and stock so that listings stay accurate.
8. As a store administrator, I want to delete product listings so that products no longer offered can be removed from the catalogue.

## Database Design

The approved ERD contains four models: **User, Category, Product, and Order**.

![Approved Bluebell entity relationship diagram](public/photos/ERD.jpg)

| Model | Purpose |
| --- | --- |
| User | Stores account information and identifies the customer placing an order. |
| Category | Organises products into categories. |
| Product | Stores product names, descriptions, prices, stock, images, and category references. |
| Order | Stores the customer reference, product references, status, phone number, delivery address, and total. |

### Relationships

- A user can place multiple orders.
- A category can contain multiple products.
- An order references products through its `item` array, as shown in the approved ERD.

The diagram represents the approved target design. The existing User schema currently uses `username` and `password`; the other models are planned.

## Routes

### Existing Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Display the homepage. |
| GET | `/auth/sign-up` | Display the registration form. |
| POST | `/auth/sign-up` | Create an account. |
| GET | `/auth/sign-in` | Display the sign-in form. |
| POST | `/auth/sign-in` | Authenticate a user and create a session. |
| GET | `/auth/sign-out` | End the user session. |

### Planned Routes

Product management will be restricted to store administrators. Order routes will require authentication, and customers will only be able to access their own orders.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/products` | Browse products, with optional category filtering. |
| GET | `/products/new` | Display the new product form. |
| POST | `/products` | Create a product. |
| GET | `/products/:id` | Display product details. |
| GET | `/products/:id/edit` | Display the product editing form. |
| PUT | `/products/:id` | Update a product. |
| DELETE | `/products/:id` | Delete a product. |
| GET | `/orders` | Display the signed-in customer's orders. |
| GET | `/orders/new` | Display the order form. |
| POST | `/orders` | Create an order. |
| GET | `/orders/:id` | Display an order and its status. |

## Features

### Current Foundation

- Basic registration and sign-in with username and password.
- Password hashing with bcrypt.
- Session-based authentication with MongoDB session storage.
- EJS homepage and authentication templates.

### Planned MVP

- Responsive electronics storefront styled for Bluebell.
- Product listings, category browsing, and individual product pages.
- Full CRUD functionality for the Product model.
- Protected product management for store administrators.
- Order placement with contact and delivery information.
- Customer order history and status display.
- Prices displayed in BHD.

## Future Enhancements

- Product search and price sorting.
- Persistent shopping cart.
- Product reviews and ratings.
- Wishlists.
- English and Arabic interfaces.
- Online payment integration.
- Order confirmation emails.

## Credits

- **Inspiration:** Bluebell, Bahrain. This is an educational project and does not claim official affiliation with the store.
- **Planning:** The approved ERD is included in this repository.
