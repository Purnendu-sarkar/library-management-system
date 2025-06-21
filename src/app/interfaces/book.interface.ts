import { Model } from "mongoose";

export type BookGenre =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "BIOGRAPHY"
  | "FANTASY";

export interface IBook {
  title: string;
  author: string;
  genre: BookGenre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

// Static methods interface
export interface BookStaticMethods extends Model<IBook> {
  updateAvailability(bookId: string): Promise<void>;
}

// Instance methods interface
export interface BookInstanceMethods {
  checkAvailability(): boolean;
}
