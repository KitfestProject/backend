import nodemailer from "nodemailer";
import logger from "./logging.js";
import env_vars from "../config/env_vars.js";

export const send_email = (
  to: string,
  subject: string,
  text: string,
  name: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "zoho",
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: env_vars.EMAIL_USER,
      pass: env_vars.EMAIL_PASS,
    },
  });
  const mail_options = {
    from: env_vars.EMAIL_USER,
    to,
    subject,
    html: HTML_TEMPLATE(text, subject, name),
  };
  transporter.sendMail(mail_options, (error, info) => {
    if (error) {
      logger.error(`Error sending email: ${error}`);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};
const HTML_TEMPLATE = (text: string, subject: string, name: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f0f0f0;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #C71610;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #C71610;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>${subject}</h1>
            </div>
            <div class="email-body">
              <p>Hi there, ${name}</p>

              <p>${text}</p>
              <p>Regards</p>
            </div>
            <div class="email-footer">
              <p>Theater Ke team @2024</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
