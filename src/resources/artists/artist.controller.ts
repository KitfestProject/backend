import crud from "../../utils/crud.js";
import Artists from "../../database/models/artists.js";

const create_artist = crud.createOne(Artists);
const get_artist = crud.getOne(Artists);
const get_artists = crud.getMany(Artists);
const update_artist = crud.updateOne(Artists);
const delete_artist = crud.deleteOne(Artists);

export default {
  create_artist,
  get_artist,
  get_artists,
  update_artist,
  delete_artist,
};
