# 🚀 HTTPHub - Modern API Testing Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/w3bpiyush/HTTPHub) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/node.js-18.x+-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/) [![MongoDB](https://img.shields.io/badge/mongodb-7.0+-green.svg)](https://www.mongodb.com/) [![React Native](https://img.shields.io/badge/react--native-0.79+-blue.svg)](https://reactnative.dev/) [![Expo](https://img.shields.io/badge/expo-53+-purple.svg)](https://expo.dev/)

> **HTTPHub** is a modern, cross-platform API testing tool built with React Native and Node.js. It provides developers with a powerful yet intuitive interface to test, organize, and manage API requests across multiple platforms including mobile, web, and desktop.

## ✨ Features

### 🔐 **Authentication & Security**
- **JWT-based authentication** with secure token management
- **User registration and login** with encrypted password storage
- **Protected API endpoints** with middleware-based authorization
- **Session management** with persistent login states

### 📱 **Cross-Platform Support**
- **React Native mobile app** (iOS & Android)
- **Expo framework** for seamless development and deployment
- **Responsive design** optimized for mobile and tablet
- **Native performance** with platform-specific optimizations

### 🗂️ **Collection Management**
- **Organize API requests** into logical collections
- **Hierarchical structure** for better project organization
- **CRUD operations** for collections and requests
- **User-specific collections** with privacy controls

### 🌐 **API Testing Capabilities**
- **Multiple HTTP methods** (GET, POST, PUT, DELETE, PATCH)
- **Custom headers** with toggle controls
- **Request body support** for various content types
- **Response visualization** and status tracking
- **Environment variables** support (coming soon)

### 🎨 **Modern UI/UX**
- **Tailwind CSS** styling with NativeWind integration
- **Intuitive navigation** using Expo Router
- **Responsive layouts** for all screen sizes
- **Dark/Light theme** support (planned)
- **Accessibility features** for inclusive design

## 🏗️ Architecture

### **Backend (Node.js + Express)**
```
backend/
├── src/
│   ├── controllers/     # Business logic handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # Authentication & validation
│   ├── utils/           # Helper functions
│   ├── config.ts        # Environment configuration
│   └── server.ts        # Express server setup
├── package.json
└── tsconfig.json
```

### **Frontend (React Native + Expo)**
```
http-hub/
├── app/                 # Expo Router pages
│   ├── (auth)/         # Authentication screens
│   ├── (home)/         # Main dashboard
│   ├── collections/    # Collection management
│   └── _layout.tsx     # Root layout
├── contexts/           # React Context providers
├── types/              # TypeScript definitions
├── assets/             # Images and icons
└── package.json
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **MongoDB** 7.0 or higher
- **Expo CLI** (for mobile development)
- **Android Studio** / **Xcode** (for native builds)

### **1. Clone the Repository**
```bash
git clone https://github.com/w3bpiyush/HTTPHub.git
cd HTTPHub
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
MONGO_URI=mongodb://localhost:27017/httphub
JWT_SECRET=your_super_secret_jwt_key
PORT=3000

# Start development server
npm run dev
```

### **3. Frontend Setup**
```bash
cd ../http-hub
npm install

# Start Expo development server
npm start
```

### **4. Mobile Development**
```bash
# Install Expo Go app on your device
# Scan QR code from terminal
# Or run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

## 🔧 Configuration

### **Environment Variables**
```env
# Backend (.env)
MONGO_URI=mongodb://localhost:27017/httphub
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development

# Frontend (app.config.js)
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```


## 📱 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User authentication |

### **Collections**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/collections` | Create collection |
| `GET` | `/api/collections/user/:userId` | Get user collections |
| `PATCH` | `/api/collections/:id` | Update collection |
| `DELETE` | `/api/collections/:id` | Delete collection |

### **API Requests**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/requests` | Create API request |
| `GET` | `/api/requests/:id` | Get request details |
| `PATCH` | `/api/requests/:id` | Update request |
| `DELETE` | `/api/requests/:id` | Delete request |

## 🛠️ Development

### **Available Scripts**

#### **Backend**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run test     # Run test suite (when implemented)
```

#### **Frontend**
```bash
npm start        # Start Expo development server
npm run android  # Run on Android emulator/device
npm run ios      # Run on iOS simulator/device
npm run web      # Run in web browser
npm run build    # Build for production
```

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code linting (recommended)
- **Prettier** for code formatting (recommended)
- **Husky** for git hooks (recommended)

## 📦 Dependencies

### **Backend Dependencies**
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### **Frontend Dependencies**
- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - Navigation solution
- **NativeWind** - Tailwind CSS for React Native
- **AsyncStorage** - Local data persistence

## 🚀 Deployment

### **Backend Deployment**
```bash
# Build the application
npm run build

# Start production server
npm start

# Environment variables
NODE_ENV=production
PORT=3000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to Expo
expo publish

# Or build standalone apps
expo build:android
expo build:ios
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📋 Roadmap

### **Version 1.1.0** 🚧
- [ ] Environment variables support
- [ ] Request history and analytics
- [ ] Import/Export functionality

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Team

**HTTPHub** is developed and maintained by **Nexora Technology**

- **Lead Developer**: [Piyush Manna](https://github.com/w3bpiyush)
- **Company**: Nexora Technology
- **Location**: India 🇮🇳

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/w3bpiyush/HTTPHub/issues)
- **Email**: nexora.contacts@gmail.com
- **Documentation**: [Project Wiki](https://github.com/w3bpiyush/HTTPHub/wiki)

## 🙏 Acknowledgments

- **Expo** team for the amazing development platform
- **React Native** community for continuous improvements
- **MongoDB** for the robust database solution
- **Express.js** team for the lightweight web framework

---

<div align="center">

**Made with ❤️ in India**

*Start building better APIs with HTTPHub today!*

[![Star](https://img.shields.io/github/stars/w3bpiyush/HTTPHub?style=social)](https://github.com/w3bpiyush/HTTPHub) [![Fork](https://img.shields.io/github/forks/w3bpiyush/HTTPHub?style=social)](https://github.com/w3bpiyush/HTTPHub) [![Watch](https://img.shields.io/github/watchers/w3bpiyush/HTTPHub?style=social)](https://github.com/w3bpiyush/HTTPHub)

</div>
