import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controllers";
import { borrowRoutes } from "./app/controllers/borrow.controllers";

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Library Management System API is live!",
    endpoints: {
      books: {
        "POST /api/books": "Create a new book",
        "GET /api/books": "Get all books with filtering and sorting",
        "GET /api/books/:bookId": "Get book by ID",
        "PUT /api/books/:bookId": "Update book by ID",
        "DELETE /api/books/:bookId": "Delete book by ID",
      },
      borrow: {
        "POST /api/borrow": "Borrow a book",
        "GET /api/borrow": "Get borrowed books summary",
      },
    },
  });
});

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  res.status(500).json({
    message: "Internal server error",
    success: false,
    error: error.message,
  });
});

export default app;
