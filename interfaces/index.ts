export interface IUsers {
  name: string;
  email: string;
  is_admin: boolean;
  password: string;
}
export interface Icategories {
  name: string;
  description: string;
}
export interface IEvents {
  categories_id: string;
  name: string;
  description: number;
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
  events_id: string;
  total_capacity: number;
  seats: ISeats[];
}
export interface IResults {
  categories_id: string;
  artist_name: string;
  votes: number;
  artist_image: string;
  bio: string;
}
export interface ITickets {
  user_id: string;
  events_id: string;
  price: number;
  email: string;
  seat_number: number;
  is_paid: boolean;
}
export interface ITransaction {
  ticket_id: string;
  user_id: string;
  events_id: string;
  amount: number;
  tx_processor: string;
  ref_code: string;
  time: string;
}
