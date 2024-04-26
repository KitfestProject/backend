import { IResponseEnvelope } from "../../interfaces/index.js";

export default function createResponse<T>(
  success: boolean,
  message: string,
  data: T,
): IResponseEnvelope<T> {
  return {
    success,
    message,
    data,
  };
}
