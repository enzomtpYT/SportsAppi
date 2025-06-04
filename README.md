# SportsAppi

This project is a simple REST API built using Express and Node.js/Bun. It provides endpoints for managing items in a collection.

## Table of Contents

- [SportsAppi](#sportsappi)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [User Endpoints](#user-endpoints)
      - [`GET /api/users`](#get-apiusers)
      - [`GET /api/users/:id`](#get-apiusersid)
      - [`GET /api/users/login/:login`](#get-apiusersloginlogin)
      - [`POST /api/users`](#post-apiusers)
      - [`PUT /api/users/:id`](#put-apiusersid)
      - [`DELETE /api/users/:id`](#delete-apiusersid)
    - [Product Endpoints](#product-endpoints)
      - [`GET /api/products`](#get-apiproducts)
      - [`GET /api/products/:id`](#get-apiproductsid)
      - [`GET /api/products/:id/images`](#get-apiproductsidimages)
      - [`POST /api/products/:id/images`](#post-apiproductsidimages)
      - [`GET /api/products/category/:categoryId`](#get-apiproductscategorycategoryid)
      - [`POST /api/products`](#post-apiproducts)
      - [`PUT /api/products/:id`](#put-apiproductsid)
      - [`DELETE /api/products/:id`](#delete-apiproductsid)
      - [`GET /api/products/categories`](#get-apiproductscategories)
    - [Order Endpoints](#order-endpoints)
      - [`GET /api/orders/:id`](#get-apiordersid)
      - [`GET /api/orders/user/:userId`](#get-apiordersuseruserid)
      - [`POST /api/orders`](#post-apiorders)
      - [`PUT /api/orders/:id`](#put-apiordersid)
      - [`PATCH /api/orders/:id/state`](#patch-apiordersidstate)
  - [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/my-rest-api.git
   ```

2. Navigate to the project directory:
   ```
   cd my-rest-api
   ```

3. Install bun:
   ```
   npm install -g bun
   ```

4. Install the depencies:
   ```
   bun install
   ```

5. Copy the `.env.example` to `.env` and edit the environment variable.

## Usage

To start the server, run:
```
bun start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

All API endpoints are protected with authentication middleware. You must provide a valid API key using one of these methods:
- In the request body as `apiKey`
- In the query parameters as `apiKey`
- In the `Authorization` header

### User Endpoints

#### `GET /api/users`
- **Description**: Retrieve all users
- **Response**: Array of user objects with fields: id_user, name, surname, address, zip, city, password, login
- **Status Codes**:
  - `200 OK`: Successfully retrieved users
  - `500 Internal Server Error`: Failed to fetch users

#### `GET /api/users/:id`
- **Description**: Retrieve a specific user by ID
- **Parameters**: 
  - `id` (path): User ID
- **Response**: User object with fields: id_user, name, surname, address, zip, city, password, login
- **Status Codes**:
  - `200 OK`: Successfully retrieved user
  - `404 Not Found`: User with specified ID not found
  - `500 Internal Server Error`: Failed to fetch user

#### `GET /api/users/login/:login`
- **Description**: Retrieve a user by login name (username)
- **Parameters**: 
  - `login` (path): User login/username
- **Response**: User object with limited fields: id_user, login, password
- **Status Codes**:
  - `200 OK`: Successfully retrieved user
  - `404 Not Found`: User with specified login not found
  - `500 Internal Server Error`: Failed to fetch user

#### `POST /api/users`
- **Description**: Create a new user
- **Request Body**:
  - `name`: User's first name
  - `surname`: User's last name
  - `address`: User's address
  - `zip`: ZIP/Postal code
  - `city`: User's city
  - `password`: User's password
  - `login`: User's login/username
- **Response**: 
  - `message`: Success message
  - `id`: ID of the created user
- **Status Codes**:
  - `201 Created`: Successfully created user
  - `500 Internal Server Error`: Failed to create user

#### `PUT /api/users/:id`
- **Description**: Update an existing user
- **Parameters**:
  - `id` (path): User ID
- **Request Body**:
  - `name`: User's first name
  - `surname`: User's last name
  - `address`: User's address
  - `zip`: ZIP/Postal code
  - `city`: User's city
  - `password`: User's password
  - `login`: User's login/username
- **Response**: 
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully updated user
  - `404 Not Found`: User with specified ID not found
  - `500 Internal Server Error`: Failed to update user

#### `DELETE /api/users/:id`
- **Description**: Delete a user
- **Parameters**:
  - `id` (path): User ID
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully deleted user
  - `404 Not Found`: User with specified ID not found
  - `500 Internal Server Error`: Failed to delete user

### Product Endpoints

#### `GET /api/products`
- **Description**: Retrieve all products
- **Response**: Array of product objects with fields: reference, name, description, price, categories
- **Status Codes**:
  - `200 OK`: Successfully retrieved products
  - `500 Internal Server Error`: Failed to fetch products

#### `GET /api/products/:id`
- **Description**: Retrieve a specific product by ID (reference)
- **Parameters**:
  - `id` (path): Product reference
- **Response**: Product object with fields: reference, name, description, price, categories
- **Status Codes**:
  - `200 OK`: Successfully retrieved product
  - `404 Not Found`: Product with specified reference not found
  - `500 Internal Server Error`: Failed to fetch product

#### `GET /api/products/:id/images`
- **Description**: Retrieve all images for a specific product
- **Parameters**:
  - `id` (path): Product reference
- **Response**: Array of image objects
- **Status Codes**:
  - `200 OK`: Successfully retrieved images
  - `500 Internal Server Error`: Failed to fetch product images

#### `POST /api/products/:id/images`
- **Description**: Add an image to a product
- **Parameters**:
  - `id` (path): Product reference
- **Request Body**:
  - `name`: Image name
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `201 Created`: Successfully added image
  - `400 Bad Request`: Missing required fields
  - `404 Not Found`: Product not found
  - `500 Internal Server Error`: Failed to add image

#### `GET /api/products/category/:categoryId`
- **Description**: Retrieve all products from a specific category
- **Parameters**:
  - `categoryId` (path): Category ID
- **Response**: Array of product objects with fields: reference, name, description, price, categories
- **Status Codes**:
  - `200 OK`: Successfully retrieved products
  - `500 Internal Server Error`: Failed to fetch products

#### `POST /api/products`
- **Description**: Create a new product
- **Request Body**:
  - `reference`: Product reference (ID)
  - `name`: Product name
  - `description`: Product description (optional)
  - `price`: Product price
- **Response**:
  - `message`: Success message
  - `reference`: Product reference
- **Status Codes**:
  - `201 Created`: Successfully created product
  - `400 Bad Request`: Missing required fields
  - `500 Internal Server Error`: Failed to create product

#### `PUT /api/products/:id`
- **Description**: Update an existing product
- **Parameters**:
  - `id` (path): Product reference
- **Request Body**:
  - `name`: Product name
  - `description`: Product description
  - `price`: Product price
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully updated product
  - `404 Not Found`: Product not found
  - `500 Internal Server Error`: Failed to update product

#### `DELETE /api/products/:id`
- **Description**: Delete a product
- **Parameters**:
  - `id` (path): Product reference
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully deleted product
  - `404 Not Found`: Product not found
  - `500 Internal Server Error`: Failed to delete product

#### `GET /api/products/categories`
- **Description**: Retrieve all product categories
- **Response**: Array of category objects with fields: id_category, name
- **Status Codes**:
  - `200 OK`: Successfully retrieved categories
  - `500 Internal Server Error`: Failed to fetch categories

> **Note**: The `categories` field returned in product endpoints is an array of objects with `id_category` and `name` fields.

### Order Endpoints

#### `GET /api/orders/:id`
- **Description**: Retrieve a specific order by ID
- **Parameters**:
  - `id` (path): Order ID
- **Response**: Order object with fields: id_order, date_, delivery_address, prixtotal, status, id_user
- **Status Codes**:
  - `200 OK`: Successfully retrieved order
  - `404 Not Found`: Order not found
  - `500 Internal Server Error`: Failed to fetch order

#### `GET /api/orders/user/:userId`
- **Description**: Retrieve all orders for a specific user
- **Parameters**:
  - `userId` (path): User ID
- **Response**: Array of order objects
- **Status Codes**:
  - `200 OK`: Successfully retrieved orders
  - `500 Internal Server Error`: Failed to fetch orders

#### `POST /api/orders`
- **Description**: Create a new order
- **Request Body**:
  - `delivery_address`: Delivery address
  - `prixtotal`: Total price of the order
  - `id_user`: User ID
  - `products`: Array of objects with `reference` and `quantity`
- **Response**:
  - `message`: Success message
  - `orderId`: ID of the created order
- **Status Codes**:
  - `201 Created`: Successfully created order
  - `500 Internal Server Error`: Failed to create order

#### `PUT /api/orders/:id`
- **Description**: Update an existing order
- **Parameters**:
  - `id` (path): Order ID
- **Request Body**:
  - `delivery_address`: Delivery address
  - `prixtotal`: Total price of the order
  - `products`: Array of objects with `reference` and `quantity`
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully updated order
  - `500 Internal Server Error`: Failed to update order

#### `PATCH /api/orders/:id/state`
- **Description**: Update the status of an order
- **Parameters**:
  - `id` (path): Order ID
- **Request Body**:
  - `status`: New status value
- **Response**:
  - `message`: Success message
- **Status Codes**:
  - `200 OK`: Successfully updated order state
  - `404 Not Found`: Order not found
  - `500 Internal Server Error`: Failed to update order state

## License

This project is licensed under the MIT License.