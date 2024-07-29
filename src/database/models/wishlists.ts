import { Schema, model } from "mongoose";
import { IWishlist } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const wishlist_schema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Events",
      required: true,
    },
  },
  { timestamps: true },
);

const Wishlists: TModel<IWishlist> = model("Wishlist", wishlist_schema);
export default Wishlists;
