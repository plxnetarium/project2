# Bluebell — Electronics Store

## Overview

Bluebell is an educational ecommerce project inspired by Bluebell Computers in Bahrain. Visitors can search and filter the catalogue, view product details, and see prices in Bahraini dinars (BHD). Signed-in customers can add and remove items from their cart. Administrators can manage products and categories and review stock levels from a dashboard.

The cart is implemented. Checkout, order placement, and order history are planned.

## Screenshots

Storefront and dashboard screenshots are pending. The approved ERD is included under [Database Design](#database-design).

## Technologies Used

| Technology | Purpose |
| --- | --- |
| Node.js, Express, and EJS | Server, routes, and rendered pages |
| HTML, CSS, JavaScript, and Bootstrap | Layout, styling, and catalogue filters |
| MongoDB and Mongoose | Application data and models |
| express-session and connect-mongo | Session and cart storage |
| bcrypt and express-validator | Password hashing and sign-up email validation |
| Nodemailer | Email confirmation and password reset |
| Multer, multer-storage-cloudinary, and Cloudinary | Product photo uploads |
| Chart.js | Admin inventory bar chart |

## Getting Started

1. Clone the repository and open its directory. You’ll need Node.js, npm, and a local or hosted MongoDB database.
2. Run `npm install`.
3. Create a `.env` file in the project root using the example below. Use your own values and keep `.env` private.
4. Run `npm start` and visit [http://localhost:3000](http://localhost:3000).

```env
PORT=3000
APP_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/bluebell
SESSION_SECRET=replace-with-a-long-random-secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM="Bluebell Computers <sender@example.com>"

CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Set up SMTP to test email confirmation and password reset. If you use Ethereal, open the message in its test inbox. Set `APP_BASE_URL` to your public HTTPS address when deployed so email links point to the deployed app. Cloudinary credentials are needed for uploading photos from a file. You can also enter an image URL in the product form.

To try the admin dashboard locally, sign up, confirm your email, and set your test account’s `role` to `"admin"` in MongoDB. Sign out and sign back in, open `/admin`, and add a category before creating your first product.

## User Stories

1. As a visitor, I want to create an account so that I can place orders.
2. As a registered user, I want to sign in and sign out so that I can access my account securely.
3. As a customer, I want to browse products by category and view their details so that I can find suitable electronics.
4. As a customer, I want to select products and provide my phone number and delivery address so that I can place an order.
5. As a customer, I want to view my previous orders and their status so that I can keep track of my purchases.
6. As a store administrator, I want to create product listings so that customers can discover new products.
7. As a store administrator, I want to update product information, prices, and stock so that listings stay accurate.
8. As a store administrator, I want to delete product listings so that products no longer offered can be removed from the catalogue.

Order placement and history in stories 1, 4, and 5 describe the planned checkout flow.

## Database Design

![Approved Bluebell entity relationship diagram](public/photos/ERD.jpg)

| Model | Purpose |
| --- | --- |
| User | Stores the customer’s name, email, hashed password, role, and email verification and reset data. |
| Category | Groups products by category. |
| Product | Stores the name, description, price, stock, image URL, and category reference. |
| Order | Defines the customer and product references, status, phone, delivery address, and total for planned checkout. |

Each product references one category. An order references one user and stores product references in its `item` array. The cart lives in the MongoDB-backed Express session as product IDs and quantities. The `sessions` collection is managed by connect-mongo.

## Routes

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | Homepage and catalogue search |
| GET | `/product` | Public | Product listing with search and category filters |
| GET | `/product/:id` | Public | Product details |
| GET / POST | `/auth/sign-up` | Public | Show registration and create an account |
| GET / POST | `/auth/verify-email` | Confirmation link | Show the confirmation form and verify the email |
| GET / POST | `/auth/sign-in` | Public | Show sign-in and authenticate the user |
| GET | `/auth/sign-out` | Public | End the current session |
| GET / POST | `/auth/forgot-password` | Public | Show the form and request a password reset link |
| GET / POST | `/auth/reset-password` | Reset link | Show the form and save a new password |
| GET / POST | `/cart` | Signed in | View the cart or add a product |
| DELETE | `/cart/:productId` | Signed in | Remove a product from the cart |
| GET | `/admin` | Admin | Catalogue counts, inventory chart, and product table |
| GET / POST | `/category/new` / `/category` | Admin | Show the form and create a category |
| GET / POST | `/product/new` / `/product` | Admin | Show the form and create a product |
| GET | `/product/:id/edit` | Admin | Show the product editing form |
| PUT / DELETE | `/product/:id` | Admin | Update or delete a product |

## Features

- Search product names and descriptions, filter by category, and open product detail pages.
- Register with email confirmation, sign in, sign out, and request a password reset.
- Add or remove cart items, with stock checks, quantities, and BHD totals.
- Create, view, edit, and delete products. Upload photos to Cloudinary or enter image URLs.
- Create categories and manage the catalogue from the admin dashboard, which shows a stock breakdown in a Chart.js bar chart.

## Future Enhancements

- Checkout with delivery details, order confirmation, and order history.
- Cart quantity editing and a cart that persists across sessions.
- Price sorting, product reviews, and wishlists.
- English and Arabic interfaces and online payment integration.

## Credits

Inspired by Bluebell Computers in Bahrain. This project was built for educational purposes.
