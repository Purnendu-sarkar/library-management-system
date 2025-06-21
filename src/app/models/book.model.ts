import { model, Schema } from "mongoose";
import {
  IBook,
  BookStaticMethods,
  BookInstanceMethods,
} from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, BookStaticMethods, BookInstanceMethods>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    copies: {
      type: Number,
      required: [true, "Copies is required"],
      min: [0, "Copies must be a positive number"],
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value);
        },
        message: "Copies must be an integer",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Instance method
bookSchema.method("checkAvailability", function () {
  return this.copies > 0;
});

// Static method
bookSchema.static("updateAvailability", async function (bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
});

// Pre middleware
bookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

// Post middleware
bookSchema.post("save", function (doc, next) {
  console.log(`Book "${doc.title}" has been saved with ${doc.copies} copies`);
  next();
});

export const Book = model<IBook, BookStaticMethods>("Book", bookSchema);
