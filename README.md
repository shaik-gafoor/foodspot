# 🍕 FoodSport - Food Delivery Application

A full-stack food delivery application built with React, Node.js, and MongoDB. This project consists of three main components: a customer-facing frontend, an admin dashboard, and a backend API.

## 🚀 Features

### Customer Features

- **Browse Menu**: View categorized food items with detailed descriptions
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Add/remove items and manage quantities
- **Order Management**: Place orders and track order status
- **Profile Management**: Update user information and view order history

### Admin Features

- **Dashboard**: Overview of orders, revenue, and analytics
- **Food Management**: Add, edit, and delete food items
- **Order Management**: View and update order statuses
- **User Management**: Monitor user accounts and activities

### Backend Features

- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based user authentication
- **File Upload**: Image upload for food items
- **Database Integration**: MongoDB with Mongoose ODM
- **Security**: CORS, bcrypt password hashing

## 🛠️ Tech Stack

### Frontend & Admin

- **React** 19.1.0 - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **CSS3** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
FoodSport/
├── Frontend/           # Customer-facing React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── Context/    # React context for state management
│   │   └── assets/     # Images and static assets
│   └── package.json
├── admin/              # Admin dashboard React application
│   ├── src/
│   │   ├── components/ # Admin UI components
│   │   ├── pages/      # Admin pages (Add, List, Orders)
│   │   └── assets/     # Admin assets
│   └── package.json
├── Backend/            # Node.js Express server
│   ├── controllers/    # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Database configuration
│   ├── uploads/        # Uploaded images
│   └── server.js       # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shaik-gafoor/foodspot.git
   cd FoodSport
   ```

2. **Install Backend Dependencies**

   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../Frontend
   npm install
   ```

4. **Install Admin Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Setup

Create a `.env` file in the `Backend` directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd Backend
   npm run server
   ```

   Server will run on `http://localhost:4000`

2. **Start the Frontend Application**

   ```bash
   cd Frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

3. **Start the Admin Dashboard**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on `http://localhost:5174`

## 📚 API Endpoints

### Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Food Management

- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add new food item (Admin)
- `POST /api/food/remove` - Remove food item (Admin)

### Cart Management

- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get cart items

### Order Management

- `POST /api/order/place` - Place new order
- `POST /api/order/verify` - Verify payment
- `POST /api/order/userorders` - Get user orders
- `GET /api/order/list` - Get all orders (Admin)
- `POST /api/order/status` - Update order status (Admin)

## 🔧 Development

### Building for Production

**Frontend:**

```bash
cd Frontend
npm run build
```

**Admin:**

```bash
cd admin
npm run build
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Shaik Gafoor**

- GitHub: [@shaik-gafoor](https://github.com/shaik-gafoor)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- All open-source contributors

---

**Happy Coding! 🚀**
