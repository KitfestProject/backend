import Contacts from "../../database/models/contacts.js";
import crud from "../../utils/crud.js";

const create_contact = crud.createOne(Contacts);
const fetch_contact = crud.getMany(Contacts);

export default { create_contact, fetch_contact };
