import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import env_vars from "../config/env_vars.js";

const s3 = new AWS.S3({
  accessKeyId: env_vars.ACCESS_KEY_ID,
  secretAccessKey: env_vars.ACCESS_SECRET_KEY,
  endpoint: env_vars.ENDPOINT,
  region: env_vars.REGION,
  s3ForcePathStyle: true,
});

const upload = multer({
  storage: multerS3({
    // @ts-ignore
    s3: s3,
    bucket: env_vars.BUCKET,
    acl: "public-read",
    key: function (_, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
function get_public_url(key: string) {
  return `${env_vars.ENDPOINT}/${env_vars.BUCKET}/${key}`;
}

export default { upload, get_public_url, s3 };
