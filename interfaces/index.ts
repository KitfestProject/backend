import { Schema, Document } from "mongoose";

export interface IUsers {
  name: string;
  email: string;
  is_admin: boolean;
  is_organizer: boolean;
  organizer_name: string;
  password: string;
  preferences: IPreference;
  created_at: string;
  updated_at: string;
  active: boolean;
  is_verified: boolean;
  last_login: string;
}
export interface ICategories extends Document {
  name: string;
  description: string;
}
export interface IEvents {
  category: Schema.Types.ObjectId;
  venue: Schema.Types.ObjectId;
  tickets: Schema.Types.ObjectId[];
  organizer: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  attendees: Schema.Types.ObjectId[];
  name: string;
  description: string;
  icon: string;
  location: string;
  starts_on: string;
  ends_on: string;
  duration: string;
  images: string[];
  videos: string[];
}
export interface IVenues extends Document {
  sections: Schema.Types.ObjectId[];
  name: string;
  location: string;
  capacity: number;
  contact: string;
  image: string;
}
export interface ISections {
  name: string;
  seats: Schema.Types.ObjectId[];
}
export interface ISeats {
  raw: number;
  x_axis: number;
  y_axis: number;
  number: number;
  price: number;
  is_taken: boolean;
  is_selected: boolean;
}
export interface IReviews {
  user_id: Schema.Types.ObjectId;
  event_id: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  created_at: string;
}
export interface IOrganizers {
  name: string;
  email: string;
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
  seat_id: Schema.Types.ObjectId;
  price: number;
  ticket_type: string;
  seat_number: number;
  purchased_at: string;
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
export interface IJwtPayload {
  id: string;
  email: string;
  is_admin: boolean;
}
export interface IPreference {
  musical: string[];
  play: string[];
  dance: string[];
}
