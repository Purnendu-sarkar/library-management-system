import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value);
        },
        message: "Quantity must be a positive integer",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre middleware
borrowSchema.pre("save", function (next) {
  console.log(
    `Creating borrow record for ${this.quantity} copies of book ${this.book}`
  );
  next();
});

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
