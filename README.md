# 🏪 Store Rating Management System - Backend API

A secure and role-based RESTful backend API for managing users, stores, and store ratings.

This project allows users to register, log in, browse stores, and submit ratings. Administrators can manage users and stores, while store owners can access their store dashboard and view ratings submitted by users.

---

## 🚀 Features

### 👤 Authentication

- User registration
- User login with JWT authentication
- Protected routes using JWT middleware
- Secure password hashing using `bcryptjs`
- Logout endpoint
- Password update functionality

### 👥 User Management

- View all users
- Search users by name, email, address, and role
- Create users with different roles
- Update user details
- Delete users
- Get current logged-in user
- Get user details by ID
- Dashboard statistics for administrators

### 🏪 Store Management

- View all stores
- Search stores by name, email, and address
- View store details
- Create, update, and delete stores
- Assign stores to store owners
- Prevent assigning multiple stores to the same store owner
- Calculate average store ratings
- Display total ratings

### ⭐ Rating System

- Users can submit ratings from **1 to 5**
- Users can update their existing ratings
- One user can submit only one rating per store
- View the current user's rating for a store
- Automatic average rating calculation

### 🧑‍💼 Role-Based Access Control

| Role          | Description                          |
| ------------- | ------------------------------------ |
| `super_admin` | Highest level administrator          |
| `admin`       | Manages users and stores             |
| `user`        | Can browse stores and submit ratings |
| `store_owner` | Can access their store dashboard     |

### 🔐 Security

- JWT Authentication
- Password hashing using bcrypt
- Helmet for HTTP security headers
- CORS configuration
- Request validation using `express-validator`
- Role-based authorization

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT
- bcryptjs
- express-validator
- Helmet
- CORS
- dotenv

---

## 📁 Project Structure

```text
roxiler_assignment/
└── backend/
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── authController.js
    │   ├── ratingController.js
    │   ├── storeController.js
    │   └── userController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── validationMiddleware.js
    ├── models/
    │   ├── index.js
    │   ├── ratingModel.js
    │   ├── storeModel.js
    │   └── userModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── ratingRoute.js
    │   ├── storeRoutes.js
    │   └── userRoutes.js
    ├── scripts/
    │   └── seedSuperAdmin.js
    ├── validations/
    │   └── validators.js
    ├── .env
    ├── package.json
    ├── package-lock.json
    └── server.js
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/Harsh-Kumar-Mishra2006/store_rating_backend>
cd roxiler_assignment/backend
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost

# Enable SSL only if required
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Super Admin Configuration
SUPER_ADMIN_NAME=Super System Administrator
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=Super@123456
SUPER_ADMIN_ADDRESS=System Headquarters
```

> ⚠️ Never upload your `.env` file to GitHub.

---

## 🗄️ Database Configuration

The application uses **MySQL with Sequelize ORM**.

When the server starts, the application:

1. Connects to the database
2. Authenticates the database connection
3. Synchronizes Sequelize models
4. Creates required tables if needed
5. Seeds a Super Admin if one does not already exist

Database synchronization:

```javascript
await sequelize.sync({ force: false });
```

Using `force: false` ensures existing database data is not deleted.

---

## ▶️ Running the Application

Start the server:

```bash
npm start
```

The API will run on:

```text
http://localhost:5000
```

---

# 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

After successful registration or login, the API returns a JWT token.

Example response:

```json
{
  "message": "Login successful",
  "token": "your_jwt_token",
  "user": {
    "id": 1,
    "name": "Example User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

For protected routes, send the token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📡 API Endpoints

## 🔐 Authentication Routes

Base URL:

```text
/api/auth
```

### Register User

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "Johnathan Example User",
  "email": "john@example.com",
  "password": "Password@123",
  "address": "New Delhi, India"
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Logout

```http
POST /api/auth/logout
```

🔒 Authentication Required

---

# 👥 User Routes

Base URL:

```text
/api/users
```

### Get Current User

```http
GET /api/users/me
```

🔒 Authentication Required

### Update Password

```http
PUT /api/users/password
```

🔒 Authentication Required

Request body:

```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

### Get All Users

```http
GET /api/users
```

🔒 Admin / Super Admin Only

Supported filters:

```text
/api/users?name=john
/api/users?email=john@example.com
/api/users?address=Delhi
/api/users?role=user
```

### Get User by ID

```http
GET /api/users/:id
```

🔒 Authentication Required

### Create User

```http
POST /api/users
```

🔒 Admin / Super Admin Only

Request body:

```json
{
  "name": "Store Owner Example User",
  "email": "owner@example.com",
  "password": "Password@123",
  "address": "Mumbai, India",
  "role": "store_owner"
}
```

Available roles:

```text
admin
user
store_owner
```

### Update User

```http
PUT /api/users/:id
```

🔒 Admin / Super Admin Only

### Delete User

```http
DELETE /api/users/:id
```

🔒 Admin / Super Admin Only

Restrictions:

- Super Admin cannot be deleted.
- Users cannot delete their own account.

### Get Dashboard Statistics

```http
GET /api/users/dashboard
```

🔒 Admin / Super Admin Only

Example response:

```json
{
  "total_users": 25,
  "total_stores": 10,
  "total_ratings": 75
}
```

---

# 🏪 Store Routes

Base URL:

```text
/api/stores
```

### Get All Stores

```http
GET /api/stores
```

Supported filters:

```text
/api/stores?name=Coffee
/api/stores?email=store@example.com
/api/stores?address=Delhi
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Coffee House",
    "email": "coffee@example.com",
    "address": "Delhi, India",
    "overall_rating": 4.5,
    "user_rating": 5,
    "total_ratings": 10
  }
]
```

### Get Store by ID

```http
GET /api/stores/:id
```

Returns:

- Store details
- Store owner details
- Ratings
- Average rating
- Total ratings

### Create Store

```http
POST /api/stores
```

🔒 Admin / Super Admin Only

Request body:

```json
{
  "name": "Coffee House",
  "email": "coffee@example.com",
  "address": "New Delhi, India",
  "owner_id": 5
}
```

The assigned owner must have the `store_owner` role.

### Update Store

```http
PUT /api/stores/:id
```

🔒 Admin / Super Admin Only

### Delete Store

```http
DELETE /api/stores/:id
```

🔒 Admin / Super Admin Only

### Get Store Owners

```http
GET /api/stores/owners/list
```

🔒 Admin / Super Admin Only

Returns all users with the `store_owner` role.

---

# ⭐ Rating Routes

Base URL:

```text
/api/ratings
```

All rating routes require authentication.

### Submit or Update Rating

```http
POST /api/ratings/stores/:storeId/ratings
```

Request body:

```json
{
  "rating": 5
}
```

Rating range:

```text
1 - 5
```

If the user has already rated the store, the existing rating is updated.

### Get Current User Rating

```http
GET /api/ratings/stores/:storeId/ratings
```

Example response:

```json
{
  "has_rated": true,
  "rating": 4
}
```

---

# 🧑‍💼 Store Owner Dashboard

```http
GET /api/stores/owner/dashboard
```

🔒 Store Owner Only

The dashboard provides:

- Store information
- Average rating
- Total ratings
- Users who submitted ratings
- Individual ratings
- Rating submission timestamps

---

# 🗃️ Database Models

## 👤 User

| Field    | Description          |
| -------- | -------------------- |
| id       | Unique user ID       |
| name     | User name            |
| email    | Unique email address |
| password | Hashed password      |
| address  | User address         |
| role     | User role            |

### Validation

**Name**

- Minimum: 20 characters
- Maximum: 60 characters

**Password**

- Minimum: 8 characters
- Maximum: 16 characters
- At least one uppercase letter
- At least one special character

---

## 🏪 Store

| Field    | Description    |
| -------- | -------------- |
| id       | Store ID       |
| name     | Store name     |
| email    | Store email    |
| address  | Store address  |
| owner_id | Store owner ID |

---

## ⭐ Rating

| Field    | Description               |
| -------- | ------------------------- |
| id       | Rating ID                 |
| rating   | Rating value (1-5)        |
| user_id  | User who submitted rating |
| store_id | Rated store               |

### Rating Rule

Each user can submit only **one rating per store**.

This is enforced using a unique constraint:

```text
user_id + store_id
```

---

# 🔗 Database Relationships

```text
User
 │
 ├── hasMany ─── Ratings
 │
 └── hasOne ─── Store (Store Owner)


Store
 │
 ├── belongsTo ─── User (Owner)
 │
 └── hasMany ─── Ratings


Rating
 │
 ├── belongsTo ─── User
 │
 └── belongsTo ─── Store
```

---

# 🔒 Role Permissions

| Feature               | Super Admin | Admin | User | Store Owner |
| --------------------- | :---------: | :---: | :--: | :---------: |
| Register/Login        |     ✅      |  ✅   |  ✅  |     ✅      |
| Browse Stores         |     ✅      |  ✅   |  ✅  |     ✅      |
| Submit Ratings        |     ✅      |  ✅   |  ✅  |     ✅      |
| Create Users          |     ✅      |  ✅   |  ❌  |     ❌      |
| Update Users          |     ✅      |  ✅   |  ❌  |     ❌      |
| Delete Users          |     ✅      |  ✅   |  ❌  |     ❌      |
| Create Stores         |     ✅      |  ✅   |  ❌  |     ❌      |
| Update Stores         |     ✅      |  ✅   |  ❌  |     ❌      |
| Delete Stores         |     ✅      |  ✅   |  ❌  |     ❌      |
| View Dashboard Stats  |     ✅      |  ✅   |  ❌  |     ❌      |
| Store Owner Dashboard |     ❌      |  ❌   |  ❌  |     ✅      |

---

# 🛡️ Security Features

### Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

### JWT Authentication

JWT tokens are used to authenticate protected routes.

### HTTP Security

The project uses:

```text
helmet
```

to help secure HTTP headers.

### CORS

CORS is configured using the frontend URL provided through:

```text
CLIENT_URL
```

### Request Validation

The project uses:

```text
express-validator
```

for validating incoming request data.

---

# 🌱 Super Admin Seeding

When the application starts, it checks whether a Super Admin already exists.

If no Super Admin exists, one is automatically created using:

```env
SUPER_ADMIN_NAME
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
SUPER_ADMIN_ADDRESS
```

The seeding logic is located in:

```text
scripts/seedSuperAdmin.js
```

> ⚠️ Change the default Super Admin password after the first login.

---

# ⚠️ Error Handling

The API handles common errors such as:

```text
400 - Bad Request / Validation Error
401 - Authentication Required
401 - Invalid Token
401 - Token Expired
403 - Access Denied
404 - Resource Not Found
500 - Internal Server Error
```

---

# 📦 Available Scripts

### Start Server

```bash
npm start
```

---

# 🧪 API Testing

You can test the API using:

- Postman
- Thunder Client
- Insomnia

Recommended workflow:

1. Register or create a user
2. Login
3. Copy the JWT token
4. Add the token to the Authorization header
5. Test protected routes

Example:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📌 Future Improvements

- [ ] Pagination for users and stores
- [ ] Advanced filtering and sorting
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] Swagger / OpenAPI documentation
- [ ] Unit testing
- [ ] Integration testing
- [ ] Deployment configuration

---

# 👨‍💻 Author

**Harsh Kumar Mishra**

---
