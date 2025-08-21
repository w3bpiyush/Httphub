# Httphub - API Testing Tool

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourname/httphub) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/typescript-5.0.x-blue.svg)](https://www.typescriptlang.org/) [![MongoDB](https://img.shields.io/badge/mongodb-7.0.x-green.svg)](https://www.mongodb.com/)

## What is Httphub?

Httphub is a simple and easy-to-use API testing tool. It helps developers test their APIs quickly and works great on mobile phones too. You can organize your API tests, save them in collections, and share them with your team.

## Main Features

### 🔍 Save Your API Tests
- Keep all your API requests in one place
- Group similar tests together in collections
- Easy to find and run your tests again

### 📝 Easy Request Setup  
- Turn headers and parameters on/off as needed
- Quick setup for different testing needs
- Simple controls for each request

### 📜 Send Different Data Types
- Send JSON, XML, HTML, or plain text
- Choose the right format for your API
- Switch between formats easily

### 🌐 Form Data Made Simple
- Handle form submissions easily
- Switch between raw data and form data
- Works with any type of API

### 🔐 Multiple Login Types
- Basic username/password login
- Bearer token support  
- API key authentication
- OAuth2 for secure APIs

### 📁 Share Your Work (Next Update)
- Export your test collections
- Backup your important tests

### 📱 Works on Mobile (Coming Soon)
- Designed for phone and tablet use
- Test APIs anywhere, anytime
- Same features on all devices

### 🔒 User Accounts
- Create account with your name and company
- Secure login system
- Keep your tests private

## How to Install

### What You Need
- Node.js version 18 or newer
- MongoDB database
- npm (comes with Node.js)

### Setup Steps

1. **Download the Code**
   ```bash
   git clone https://github.com/w3bpiyush/Httphub.git
   cd httphub
   ```

2. **Install Required Files**
   ```bash
   npm install
   ```

3. **Setup Configuration**
   Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. **Start the App**
   ```bash
   npm run build
   npm run dev
   ```

## API Endpoints

### User Account
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in to your account

### Collections
- `POST /api/collections` - Create new collection
- `GET /api/collections/user/:userId` - Get your collections  
- `PATCH /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### API Requests
- `POST /api/requests` - Save new API request
- `GET /api/requests/:id` - Get saved request
- `PATCH /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request


## Project Files

```
httphub/
├── src/
│   ├── controllers/     # Handle requests
│   ├── models/          # Database setup
│   ├── routes/          # API paths  
│   ├── middleware/      # Security
│   ├── utils/           # Helper tools
│   └── server.ts        # Main file
├── dist/                # Built files
├── package.json         # Project info
└── .env                 # Settings
```

## What Httphub Can Do

- **Test Any API**: GET, POST, PUT, DELETE requests
- **Easy Headers**: Turn headers on/off for each test
- **Multiple Formats**: JSON, XML, Text, Form data
- **Secure Testing**: Basic auth, tokens, API keys
- **Stay Organized**: Group tests in collections
- **Team Friendly**: Share your test collections

## Coming Soon

### Version 1.0.0 (Current)
- [✓] Save API requests in collections
- [✓] Custom headers and settings
- [✓] Multiple data formats
- [✓] Form data support
- [✓] User login system
- [✓] Works on mobile phones
- [ ] Native mobile app

### Version 1.1.0 (Next)
- [ ] Environment variables
- [ ] Copy requests
- [ ] Add import/export

## How to Help

Want to make HttpHub better?

1. Fork this project
2. Make your changes  
3. Send a pull request
4. We'll review and add it

## License

This project uses MIT License - free to use and modify.

## Who Made This

**Created by Nexora Technology**
- **Developer**: Piyush Manna
- **Made in India**: 🇮🇳

## Need Help?

- Create an issue here on GitHub
- Email: nexora.contacts@gmail.com

---

**Start testing your APIs better with HttpHub!**

*Simple, fast, and works everywhere.*
