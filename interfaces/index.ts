import { Schema, Document } from "mongoose";

export interface IUsers extends Document {
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
export interface IEvents extends Document {
  category: Schema.Types.ObjectId;
  venue: Schema.Types.ObjectId;
  tickets: ITickets[];
  organizer: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  attendees: Schema.Types.ObjectId[];
  description: string;
  duration: string;
  images: string[];
  videos: string[];
  title: string;
  tags: string[];
  cover_image: string;
  address: string;
  longitude: string;
  latitude: string;
  event_date: EventDate;
  event_start_time: string;
  event_end_time: string;
  is_paid: "paid" | "free";
  is_scheduled_published: boolean;
  publication_date: string;
  publish_time: string;
}
interface EventDate {
  start_date: string;
  end_date: string;
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
export interface ITickets extends Document {
  user_id: Schema.Types.ObjectId | null;
  event: {
    id: Schema.Types.ObjectId;
    title: string;
  };
  organizer: Schema.Types.ObjectId;
  seat_id: Schema.Types.ObjectId;
  ticket_type: string;
  seat_number: number;
  purchased_at: string;
  ticket_price: number;
  ticket_discount_price: number;
  ticket_quantity: number;
  ticket_description: string;
  ticket_start_date: string;
  ticket_end_date: string;
  ticket_start_time: string;
  ticket_end_time: string;
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
export interface IBlog extends Document {
  name: String;
  description: String;
  category: Schema.Types.ObjectId;
  tags: String[];
  cover_image: string;
  content: String;
  created_at: String;
  updated_at: String;
  active: Boolean;
}
export interface IArtist extends Document {
  name: string;
  category: Schema.Types.ObjectId;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}
export interface IPreference extends Document {
  name: string;
  icon: string;
  interests: IInterests[];
}
export interface IInterests {
  title: string;
}
export interface IResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
}
export interface IPreference {
  musical: Schema.Types.ObjectId[];
  play: Schema.Types.ObjectId[];
  dance: Schema.Types.ObjectId[];
}
export interface IContact extends Document {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}
/*
{
  "title": "",
  "description": "",
  "category": "",
  "tags": [],
  "coverImage": null,
  "address": "",
  "longitude": "",
  "latitude": "",
  "eventDate": {
    "start_date": null,
    "end_date": null
  },
  "eventStartTime": "",
  "eventEndTime": "",
  "isPaid": "paid",
  "tickets": [
    {
      "ticketType": "earlyBird",
      "ticketPrice": "",
      "ticketDiscountPrice": "",
      "ticketQuantity": "",
      "ticketDescription": "",
      "ticketStartDate": "2024-06-12T08:20:36.619Z",
      "ticketEndDate": "2024-06-12T08:20:36.619Z",
      "ticketStartTime": null,
      "ticketEndTime": null
    }
  ],
  "isScheduledPublished": false,
  "publicationDate": null,
  "publishTime": null
}
*/
