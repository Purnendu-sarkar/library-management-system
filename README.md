# 📚 Library Management System API

A comprehensive Library Management System built with Express.js, TypeScript, and MongoDB. This API allows you to manage books and track borrowing activities with advanced features like filtering, sorting, and aggregation pipelines.

## 🚀 Features

- **Book Management**: Create, read, update, and delete books
- **Borrowing System**: Track book borrowing with quantity and due dates
- **Advanced Filtering**: Filter books by genre with sorting options
- **Aggregation Pipeline**: Get borrowed books summary with total quantities
- **Business Logic**: Automatic availability management based on copies
- **Validation**: Comprehensive input validation using Zod
- **MongoDB Integration**: Full CRUD operations with Mongoose
- **TypeScript**: Type-safe development
- **Error Handling**: Comprehensive error responses

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Additional**: validator library

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd library-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory