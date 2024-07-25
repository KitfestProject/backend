import { Router } from "express";
import user_routes from "../resources/users/user.route.js";
import category_routes from "../resources/categories/category.route.js";
import venue_routes from "../resources/venues/venue.route.js";
import preference_router from "../resources/preferences/prefernce.route.js";
import events_routes from "../resources/events/events.routes.js";
import contact_router from "../resources/contacts/contact.router.js";
import blog_router from "../resources/blogs/blog.router.js";
import artist_router from "../resources/artists/artist.router.js";
import file_router from "../resources/files/file.router.js";
import ticket_router from "../resources/tickets/ticket.router.js";
import seatmap_router from "../resources/seatmaps/seatmap.router.js";
import booking_router from "../resources/bookings/booking.router.js";
import transaction_router from "../resources/transactions/transaction.router.js";
import overview_router from "../resources/overview/overview.router.js";

const api = Router();

api.use("/users", user_routes);
api.use("/categories", category_routes);
api.use("/venues", venue_routes);
api.use("/preference", preference_router);
api.use("/events", events_routes);
api.use("/contact", contact_router);
api.use("/blogs", blog_router);
api.use("/artists", artist_router);
api.use("/files", file_router);
api.use("/tickets", ticket_router);
api.use("/seatmap", seatmap_router);
api.use("/booking", booking_router);
api.use("/transactions", transaction_router);
api.use("/overview", overview_router);

export default api;
