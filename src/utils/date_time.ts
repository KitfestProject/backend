import moment from "moment";

export const get_current_date_time = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
