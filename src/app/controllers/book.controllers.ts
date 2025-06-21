import express, { Request, Response } from "express";
import { z } from "zod";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();

// Zod validation schema
const CreateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.number().int().min(0, "Copies must be a positive number"),
  available: z.boolean().optional(),
});

const UpdateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  genre: z
    .enum([
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ])
    .optional(),
  isbn: z.string().min(1).optional(),
  description: z.string().optional(),
  copies: z.number().int().min(0).optional(),
  available: z.boolean().optional(),
});

// Create Book
bookRoutes.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = CreateBookSchema.parse(req.body);

    const book = await Book.create(validatedData);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        error: error.errors,
      });
      return;
    }

    if (error.code === 11000) {
      res.status(400).json({
        message: "ISBN already exists",
        success: false,
        error: error,
      });
      return;
    }

    res.status(400).json({
      message: "Failed to create book",
      success: false,
      error: error,
    });
  }
});

// Get All Books with filtering and sorting
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = 10,
    } = req.query;

    // Build query object
    let query: any = {};
    if (filter) {
      query.genre = filter;
    }

    // Build sort object
    const sortOrder = sort === "asc" ? 1 : -1;
    const sortObject: any = {};
    sortObject[sortBy as string] = sortOrder;

    const books = await Book.find(query)
      .sort(sortObject)
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve books",
      success: false,
      error: error,
    });
  }
});

//  Get Book by ID
bookRoutes.get(
  "/:bookId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      const book = await Book.findById(bookId);

      if (!book) {
        res.status(404).json({
          message: "Book not found",
          success: false,
          error: "No book found with the provided ID",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error: any) {
      res.status(400).json({
        message: "Failed to retrieve book",
        success: false,
        error: error,
      });
    }
  }
);

//  Update Book
bookRoutes.put(
  "/:bookId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const validatedData = UpdateBookSchema.parse(req.body);

      const book = await Book.findByIdAndUpdate(bookId, validatedData, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        res.status(404).json({
          message: "Book not found",
          success: false,
          error: "No book found with the provided ID",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          message: "Validation failed",
          success: false,
          error: error.errors,
        });
        return;
      }

      res.status(400).json({
        message: "Failed to update book",
        success: false,
        error: error,
      });
    }
  }
);

//  Delete Book
bookRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        res.status(404).json({
          message: "Book not found",
          success: false,
          error: "No book found with the provided ID",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error: any) {
      res.status(400).json({
        message: "Failed to delete book",
        success: false,
        error: error,
      });
    }
  }
);
