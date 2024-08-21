import Team from "../../database/models/team.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_team_members_admin = async (
  start: number,
  length: number,
  search: string,
) => {
  const members = await Team.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .sort({ created_at: -1 });
  const total_records = await Team.countDocuments();
  const tranformed_members = members.map((member) => ({
    id: member._id,
    name: member.first_name + " " + member.last_name,
    email: member.email,
    phone: member.phone,
    created_at: member.created_at,
    image: member.image,
  }));
  return createResponse(true, "", {
    members: tranformed_members,
    total_records,
  });
};

export default {
  fetch_team_members_admin,
};
