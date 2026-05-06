# Product Management API

A simple and clean REST API for product management built with Node.js, Express, and MongoDB.

## Features

- ✅ Full CRUD operations for products
- ✅ Search products by name
- ✅ Filter products by category
- ✅ Pagination support
- ✅ Proper error handling
- ✅ CORS enabled for frontend integration
- ✅ Clean project structure
- ✅ Database seeding with dummy data

## Project Structure

```
product-management-api/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   └── productController.js # Business logic for products
├── middleware/
│   └── errorHandler.js      # Global error handling
├── models/
│   └── Product.js           # Product schema and model
├── routes/
│   └── productRoutes.js     # API route definitions
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── seed.js                 # Database seeding script
├── server.js               # Application entry point
└── README.md               # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env` file is already created with default values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/product-management
   NODE_ENV=development
   ```

   Update `MONGODB_URI` if you're using MongoDB Atlas or a different connection string.

4. **Make sure MongoDB is running**
   
   If using local MongoDB:
   ```bash
   # On Windows (if MongoDB is installed as a service)
   net start MongoDB
   
   # Or start manually
   mongod
   ```

5. **Seed the database with dummy products**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Production mode
   npm start

   # Development mode (with auto-restart)
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api/products
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with optional filters) |
| GET | `/api/products/:id` | Get a single product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Query Parameters

**Search by name:**
```
GET /api/products?search=laptop
```

**Filter by category:**
```
GET /api/products?category=Electronics
```

**Pagination:**
```
GET /api/products?page=1&limit=10
```

**Combine filters:**
```
GET /api/products?category=Electronics&search=wireless&page=1&limit=5
```

## Request/Response Examples

### Get All Products
```bash
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 12,
  "page": 1,
  "pages": 2,
  "data": [
    {
      "_id": "...",
      "name": "Wireless Bluetooth Headphones",
      "price": 79.99,
      "category": "Electronics",
      "stock": 50,
      "image": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Product
```bash
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Wireless Bluetooth Headphones",
    "price": 79.99,
    "category": "Electronics",
    "stock": 50,
    "image": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Product
```bash
POST /api/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 99.99,
  "category": "Electronics",
  "stock": 25,
  "image": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "New Product",
    "price": 99.99,
    "category": "Electronics",
    "stock": 25,
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Product
```bash
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Updated Product Name",
    "price": 89.99,
    "category": "Electronics",
    "stock": 25,
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Delete Product
```bash
DELETE /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {}
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Error Response Format

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Product Model Schema

```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  category: String,
  stock: Number (default: 0, min: 0),
  image: String (URL),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Testing with cURL

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

**Create a product:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":49.99,"category":"Test","stock":10}'
```

**Update a product:**
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","price":59.99}'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID
```

## Connecting from React Frontend

The API has CORS enabled, so you can connect from your Vite React app:

```javascript
// Example fetch in React
const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products');
  const data = await response.json();
  console.log(data);
};
```

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart
- `npm run seed` - Seed the database with dummy products

## Notes

- No authentication is implemented (as per requirements)
- All endpoints are public
- The API is ready for frontend integration
- MongoDB connection uses environment variables for flexibility
- Error handling is implemented globally
- Input validation is handled by Mongoose schemas

## License

ISC
