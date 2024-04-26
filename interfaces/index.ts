import { Schema } from "mongoose";

export interface IUsers {
  name: string;
  email: string;
  is_admin: boolean;
  password: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}
export interface Icategories {
  name: string;
  description: string;
}
export interface IEvents {
  categories_id: Schema.Types.ObjectId;
  name: string;
  description: string;
  location: string;
  date: string;
  icon: string;
  images: string[];
  videos: string[];
}
export interface ISeats {
  raw: number;
  column: number;
  number: number;
  is_taken: boolean;
}
export interface ISeatMaps {
  events_id: Schema.Types.ObjectId;
  total_capacity: number;
  seats: Schema.Types.ObjectId[];
}
export interface IResults {
  categories_id: Schema.Types.ObjectId;
  artist_name: string;
  votes: number;
  artist_image: string;
  bio: string;
}
export interface ITickets {
  user_id: Schema.Types.ObjectId | null;
  events_id: Schema.Types.ObjectId;
  price: number;
  email: string | null;
  seat_number: number;
  is_paid: boolean;
}
export interface ITransaction {
  ticket_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  events_id: Schema.Types.ObjectId;
  amount: number;
  tx_processor: string;
  ref_code: string;
  time: string;
}
export interface IResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
