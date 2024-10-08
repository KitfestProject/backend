import { Schema, Document } from "mongoose";

export interface IUsers extends Document {
  name: string;
  email: string;
  profile_picture: string;
  phone_number: string;
  address: string;
  country: string;
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
  role: "user" | "organizer" | "admin";
  organizer_request_status:
    | "pending"
    | "inprogress"
    | "approved"
    | "rejected"
    | "";
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
  wishlist_count: number;
  attendees: {}[]; //Indeicate the type of attendees
  description: string;
  duration: string;
  images: string[];
  videos: string[];
  title: string;
  tags: string[];
  cover_image: string;
  advertisement_banner: string | null;
  address: string;
  longitude: string;
  latitude: string;
  event_date: EventDate;
  event_start_time: string;
  event_end_time: string;
  has_seat_map: boolean;
  featured: "enabled" | "disabled";
  is_paid: "paid" | "free";
  is_scheduled_published: boolean;
  publication_date: string;
  publish_time: string;
  status: "draft" | "published" | "cancelled" | "sold_out";
  is_advertisement: "enabled" | "disabled";
  shows: IEventShows[];
}
interface IShows {
  _id: Schema.Types.ObjectId;
  bookings: number;
  scan_count: number;
  start_time: string;
  end_time: string;
}
interface IEventShows {
  _id: Schema.Types.ObjectId;
  date: string;
  shows: IShows[];
}
interface EventDate {
  start_date: string;
  end_date: string;
}
export interface IVenues extends Document {
  name: string;
  location: string;
  capacity: number;
  longitude: string;
  latitude: string;
  address: string;
  image: string;
  amenities: [
    {
      name: string;
      value: boolean;
    },
  ];
  seat_map: string;
  seat_map_url: string;
  description: string;
}
export interface ISections extends Document {
  event_id: Schema.Types.ObjectId;
  location: string;
  abbr_name: string;
  full_sec_name: string;
  total_seats: number;
  description: string;
  rows: IsectionRaw[];
}

export interface IsectionRaw {
  rowLabel: string;
  seats: ISeats[];
}

export interface ISeats {
  _id: Schema.Types.ObjectId;
  id: number;
  SN: string | null; //seat number
  column: number;
  price: number;
  discount: number;
  status: "selected" | "booked" | "available";
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
  show_id: string;
  purchased_for: string;
  organizer: Schema.Types.ObjectId;
  seat_id: Schema.Types.ObjectId;
  ticket_type: string;
  seat_number: string[];
  purchased_at: string;
  ticket_price: number;
  ticket_discount_price: number;
  ticket_quantity: number;
  _id: string;
  validated: {
    status: boolean;
    validated_at: string;
  };
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
  author: Schema.Types.ObjectId;
  tags: String[];
  cover_image: string;
  content: String;
  created_at: String;
  updated_at: String;
  active: Boolean;
}
export interface IArtist extends Document {
  name: string;
  email: string;
  role: string;
  category: Schema.Types.ObjectId;
  image: string;
  active: boolean;
  artist_content: IArtistContent[];
  created_at: string;
  updated_at: string;
}
export interface ITeamMembers extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  team: string;
  image: string;
  socials: ISocialDetails[];
  created_at: string;
  updated_at: string;
}
interface ISocialDetails {
  type: string;
  link: string;
}
export interface IArtistContent {
  title: string;
  content: string;
}
export interface IWishlist extends Document {
  event: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
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
  responded: boolean;
  response: string;
  created_at: string;
}
export interface IEventQuery {
  limit: number;
  start: number;
  location: string;
  date: string;
  paid: string;
  featured: string;
  past: boolean;
}
