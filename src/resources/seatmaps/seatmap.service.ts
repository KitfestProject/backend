import { ISeats, ISections } from "../../../interfaces/index.js";
import Sections from "../../database/models/sections.js";
import createResponse from "../../utils/response_envelope.js";
import logger from "../../utils/logging.js";

const create_seatmap_section = async (data: ISections) => {
  const check_section = await fetch_section_by_abbr_name(
    data.abbr_name,
    data.event_id.toString(),
  );

  if (check_section.success) {
    return createResponse(true, "Section already exists", check_section.data);
  }
  const section = await Sections.create(data);
  if (!section) {
    return createResponse(false, "Failed to create section", null);
  }
  return createResponse(true, "Section created succesfully", section);
};
const fetch_section_by_abbr_name = async (
  abbr_name: string,
  event_id: string,
) => {
  const section = await Sections.findOne({
    abbr_name,
    event_id,
  });
  if (!section) {
    return createResponse(false, "Section not found", null);
  }
  switch (abbr_name) {
    case "GFFL":
      const GFFL = {
        downStairsLeftSection: section,
      };
      return createResponse(true, "Section already exists", GFFL);
    case "GFM":
      const GFM = {
        downStairsMiddleSection: section,
      };
      return createResponse(true, "Section already exists", GFM);
    case "GFFR":
      const GFFR = {
        downStairsRightSection: section,
      };
      return createResponse(true, "Section already exists", GFFR);
    case "UFR":
      const UFR = {
        upstairsFrontRightSection: section,
      };
      return createResponse(true, "Section already exists", UFR);
    case "UFFL":
      const UFFL = {
        upstairsFrontLeftSection: section,
      };
      return createResponse(true, "Section already exists", UFFL);
    case "UFM":
      const UFM = {
        upstairsFrontMiddleSection: section,
      };
      return createResponse(true, "Section already exists", UFM);
    case "UBFR":
      const UBFR = {
        upstairsBackRightSection: section,
      };
      return createResponse(true, "Section already exists", UBFR);
    case "UBFL":
      const UBFL = {
        upstairsBackLeftSection: section,
      };
      return createResponse(true, "Section already exists", UBFL);
    case "UBM":
      const UBM = {
        upstairsBackMiddleSection: section,
      };
      return createResponse(true, "Section already exists", UBM);

    default:
      return createResponse(false, "Section not found", null);
  }
};
const update_section = async (id: string, data: ISections) => {
  const section = await Sections.findOneAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  console.log(section);
  if (!section) {
    return createResponse(false, "Failed to update section", null);
  }
  return createResponse(true, "Section updated succesfully", section);
};
const fetch_sections = async (event_id: string) => {
  const data = {
    downStairsLeftSection: {} as ISections,
    downStairsMiddleSection: {} as ISections,
    downStairsRightSection: {} as ISections,
    upstairsFrontRightSection: {} as ISections,
    upstairsFrontLeftSection: {} as ISections,
    upstairsFrontMiddleSection: {} as ISections,
    upstairsBackLeftSection: {} as ISections,
    upstairsBackRightSection: {} as ISections,
    upstairsBackMiddleSection: {} as ISections,
  };
  const sections = await Sections.find({ event_id });
  if (!sections) {
    return createResponse(false, "Sections not found", null);
  }
  sections.map((section) => {
    switch (section.abbr_name) {
      case "GFFL":
        data.downStairsLeftSection = section;
        data.downStairsLeftSection.total_seats = count_section_seats(
          data.downStairsLeftSection,
        );
        break;
      case "GFM":
        data.downStairsMiddleSection = section;
        data.downStairsMiddleSection.total_seats = count_section_seats(
          data.downStairsMiddleSection,
        );
        break;
      case "GFFR":
        data.downStairsRightSection = section;
        data.downStairsRightSection.total_seats = count_section_seats(
          data.downStairsRightSection,
        );
        break;
      case "UFFL":
        data.upstairsFrontLeftSection = section;
        data.upstairsFrontLeftSection.total_seats = count_section_seats(
          data.upstairsFrontLeftSection,
        );
        break;
      case "UFM":
        data.upstairsFrontMiddleSection = section;
        data.upstairsFrontMiddleSection.total_seats = count_section_seats(
          data.upstairsFrontMiddleSection,
        );
        break;
      case "UFFR":
        data.upstairsFrontRightSection = section;
        data.upstairsFrontRightSection.total_seats = count_section_seats(
          data.upstairsFrontRightSection,
        );
        break;
      case "UBFL":
        data.upstairsBackLeftSection = section;
        data.upstairsBackLeftSection.total_seats = count_section_seats(
          data.upstairsBackLeftSection,
        );
        break;
      case "UBM":
        data.upstairsBackMiddleSection = section;
        data.upstairsBackMiddleSection.total_seats = count_section_seats(
          data.upstairsBackMiddleSection,
        );
        break;
      case "UBFR":
        data.upstairsBackRightSection = section;
        data.upstairsBackRightSection.total_seats = count_section_seats(
          data.upstairsBackRightSection,
        );
        break;
      default:
        logger.error("Invalid section name");
        break;
    }
  });

  return createResponse(true, "Sections fetched successfully", data);
};
const update_section_seats = async (section_id: string, seat: ISeats) => {
  // console.log(seats);
  const result = await Sections.updateOne(
    {
      _id: section_id,
      "rows.seats._id": seat._id,
    },
    {
      $set: {
        "rows.$[].seats.$[seat]": seat,
      },
    },
    {
      arrayFilters: [{ "seat._id": seat._id }],
    },
  );
  if (result.matchedCount < 0) {
    return createResponse(false, "Failed to update seat.", null);
  }
  return createResponse(true, "Seats updated successfully", null);
};
function count_section_seats(section: ISections) {
  let total_seats = 0;
  section.rows.map((row) => {
    row.seats.map((seat) => {
      if (seat.SN) {
        total_seats++;
      }
    });
  });
  return total_seats;
}

export default {
  create_seatmap_section,
  fetch_sections,
  update_section_seats,
  update_section,
};
