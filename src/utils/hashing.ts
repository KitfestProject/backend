import { hash, compare } from "bcrypt";

const hash_text = async (text: string): Promise<string> => {
  return await hash(text, 10);
};
const compare_hash = async (text: string, hash: string): Promise<boolean> => {
  return await compare(text, hash);
};

export default { hash_text, compare_hash };
