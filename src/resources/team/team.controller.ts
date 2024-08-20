import { Request, Response } from "express";
import Team from "../../database/models/team.js";
import crud from "../../utils/crud.js";
import team_service from "./team.service.js";
import logger from "../../utils/logging.js";

const fetch_team_members_admin = async (req: Request, res: Response) => {
  try {
    const { draw, start, length, search } = req.body;
    const value = search.value;
    const team_members = await team_service.fetch_team_members_admin(
      Number(start),
      Number(length),
      value,
    );
    return res.status(200).json({
      draw,
      recordsTotal: team_members.data.total_records,
      recordsFiltered: team_members.data.members.length,
      data: team_members.data.members,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const create_team_member = crud.createOne(Team);
const fetch_team_members = crud.getMany(Team);
const fetch_team_member = crud.getOne(Team);
const update_team_member = crud.updateOne(Team);
const delete_team_member = crud.deleteOne(Team);

export default {
  create_team_member,
  fetch_team_members,
  fetch_team_member,
  update_team_member,
  delete_team_member,
  fetch_team_members_admin,
};
