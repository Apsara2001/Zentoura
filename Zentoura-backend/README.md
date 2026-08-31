# Zentoura Backend API

Production-ready backend for a multilingual travel blog platform with hotels, places, activities, and review management.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Multilingual Blog System**: Support for multiple languages with translation management
- **Hotel Management**: CRUD operations with advanced filtering (location, price, rating)
- **Places & Activities**: Comprehensive travel destination and activity management
- **Review System**: Polymorphic reviews for hotels, places, and activities
- **Image Uploads**: File upload support with validation
- **Search & Filtering**: Advanced query capabilities with pagination
- **RESTful API**: Clean, well-structured API endpoints

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **CORS**: cors
- **Environment Variables**: dotenv

## 📁 Project Structure

```
Zentoura-backend/
│
├── config/
│   └── db.js                 # Database configuration
│
├── controllers/              # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── blogController.js
│   ├── hotelController.js
│   ├── placeController.js
│   ├── activityController.js
│   └── reviewController.js
│
├── models/                   # Sequelize models
│   ├── User.js
│   ├── Blog.js
│   ├── Translation.js
│   ├── Hotel.js
│   ├── Place.js
│   ├── Activity.js
│   ├── Review.js
│   └── index.js             # Model associations
│
├── routes/                   # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── blogRoutes.js
│   ├── hotelRoutes.js
│   ├── placeRoutes.js
│   ├── activityRoutes.js
│   └── reviewRoutes.js
│
├── middlewares/              # Custom middleware
│   ├── authMiddleware.js    # JWT authentication
│   ├── roleMiddleware.js    # Role-based authorization
│   └── errorMiddleware.js   # Error handling
│
├── uploads/                  # Uploaded files
│
├── .env.example             # Environment variables template
├── .gitignore
├── app.js                   # Express app setup
├── server.js                # Server entry point
├── package.json
├── schema.sql               # Database schema
└── seed.sql                 # Sample data
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
cd Zentoura-backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zentoura_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

MAX_FILE_SIZE=5242880
```

### Step 3: Set Up Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
source schema.sql

# (Optional) Load sample data
source seed.sql
```

### Step 4: Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Blog Endpoints

#### Get All Blogs
```http
GET /api/blogs?page=1&limit=10&search=tokyo&language=en
```

#### Get Single Blog
```http
GET /api/blogs/:id
```

#### Create Blog (Admin Only)
```http
POST /api/blogs
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "title": "Blog Title",
  "content": "Blog content...",
  "language": "en",
  "featuredImage": <file>,
  "translations": [
    {
      "language": "es",
      "title": "Título del blog",
      "content": "Contenido del blog..."
    }
  ]
}
```

#### Update Blog (Admin Only)
```http
PUT /api/blogs/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

#### Delete Blog (Admin Only)
```http
DELETE /api/blogs/:id
Authorization: Bearer <admin_token>
```

### Hotel Endpoints

#### Get All Hotels (with filters)
```http
GET /api/hotels?page=1&limit=10&location=tokyo&minPrice=100&maxPrice=500&minRating=4
```

#### Get Single Hotel
```http
GET /api/hotels/:id
```

#### Create Hotel (Admin Only)
```http
POST /api/hotels
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "name": "Hotel Name",
  "description": "Description...",
  "location": "Tokyo, Japan",
  "pricePerNight": 250.00,
  "rating": 4.5,
  "image": <file>
}
```

#### Update Hotel (Admin Only)
```http
PUT /api/hotels/:id
Authorization: Bearer <admin_token>
```

#### Delete Hotel (Admin Only)
```http
DELETE /api/hotels/:id
Authorization: Bearer <admin_token>
```

### Place Endpoints

#### Get All Places
```http
GET /api/places?page=1&limit=10&search=paris&country=france
```

#### Get Single Place
```http
GET /api/places/:id
```

#### Create/Update/Delete Place (Admin Only)
Similar to hotels, requires admin authentication.

### Activity Endpoints

#### Get All Activities
```http
GET /api/activities?page=1&limit=10&location=dubai&minPrice=50&maxPrice=200
```

#### Get Single Activity
```http
GET /api/activities/:id
```

#### Create/Update/Delete Activity (Admin Only)
Similar to hotels, requires admin authentication.

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotelId": 1,
  "rating": 5,
  "comment": "Amazing hotel!"
}
```

#### Get Hotel Reviews
```http
GET /api/reviews/hotel/:hotelId
```

#### Get Place Reviews
```http
GET /api/reviews/place/:placeId
```

#### Get Activity Reviews
```http
GET /api/reviews/activity/:activityId
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **user**: Can create reviews, view all content
- **admin**: Full access to create, update, delete all content

## 🗄️ Database Schema

### Users
- id, name, email (unique), password (hashed), role, timestamps

### Blogs
- id, title, content, language, authorId (FK), featuredImage, timestamps

### Translations
- id, blogId (FK), language, translatedTitle, translatedContent, timestamps

### Hotels
- id, name, description, location, pricePerNight, rating, image, timestamps

### Places
- id, name, country, description, image, timestamps

### Activities
- id, title, description, location, price, image, timestamps

### Reviews
- id, userId (FK), hotelId/placeId/activityId (nullable), rating, comment, timestamps

## 🧪 Testing

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

## 🚢 Deployment

### Production Checklist

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up database migrations instead of `sync()`
5. Use a process manager (PM2)
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Configure CORS for specific origins
9. Set up logging and monitoring

### PM2 Deployment

```bash
npm install -g pm2
pm2 start server.js --name zentoura-api
pm2 save
pm2 startup
```

## 📝 Notes

- **Password Hashing**: Passwords are automatically hashed using bcrypt before saving
- **File Uploads**: Images are stored in the `uploads/` directory
- **Pagination**: Default limit is 10 items per page
- **Database Sync**: In development, Sequelize auto-syncs the database. Use migrations in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 👨‍💻 Author

Zentoura Development Team

---

**Ready to connect with your React frontend!** 🎉
