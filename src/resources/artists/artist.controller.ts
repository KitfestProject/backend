import { Request, Response } from "express";
import crud from "../../utils/crud.js";
import Artists from "../../database/models/artists.js";
import logger from "../../utils/logging.js";
import artist_service from "./artist.service.js";

const fetch_artists_admin = async (req: Request, res: Response) => {
  try {
    const { length, start, draw, search } = req.body;

    const response = await artist_service.fetch_artists_admin(
      start,
      length,
      search.value,
    );

    return res.status(200).json({
      draw,
      recordsTotal: response.data?.total_records,
      recordsFiltered: response.data?.artists.length,
      data: response.data?.artists,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
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
  fetch_artists_admin,
};
