import _ from "lodash";

const camel_to_snake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const convert_keys = (obj: Record<string, any>): {} => {
  if (Array.isArray(obj)) {
    return obj.map(convert_keys);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camel_to_snake(key)] = convert_keys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

export default { convert_keys };
