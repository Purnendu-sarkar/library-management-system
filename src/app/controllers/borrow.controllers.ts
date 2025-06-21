import express, { Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";

export const borrowRoutes = express.Router();

// Zod validation schema
const BorrowBookSchema = z.object({
  book: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid book ID",
  }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  dueDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    },
    {
      message: "Due date must be a valid future date",
    }
  ),
});

//  Borrow a Book
borrowRoutes.route("/").post(async (req: Request, res: Response) => {
  try {
    const validatedData = BorrowBookSchema.parse(req.body);

    // Find BOok
    const book = await Book.findById(validatedData.book);

    if (!book) {
      res.status(404).json({
        message: "Book not found",
        success: false,
        error: "No book found with the provided ID",
      });
      return;
    }

    // Check if enough copies available
    if (book.copies < validatedData.quantity) {
      res.status(400).json({
        message: "Insufficient copies available",
        success: false,
        error: `Only ${book.copies} copies available, but ${validatedData.quantity} requested`,
      });
      return;
    }

    // Create borrow record
    const borrowData = {
      book: new mongoose.Types.ObjectId(validatedData.book),
      quantity: validatedData.quantity,
      dueDate: new Date(validatedData.dueDate),
    };

    const borrowRecord = await Borrow.create(borrowData);

    // Update book copies and availability
    book.copies -= validatedData.quantity;

    // Use static method to update availability
    await book.save();
    await Book.updateAvailability(book._id.toString());

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
    return;
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
      message: "Failed to borrow book",
      success: false,
      error: error,
    });
    return;
  }
});

// Borrowed Books Summary
borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const borrowedBooksSummary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrowedBooksSummary,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve borrowed books summary",
      success: false,
      error: error,
    });
  }
});
