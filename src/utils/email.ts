import nodemailer from "nodemailer";
import logger from "./logging.js";
import env_vars from "../config/env_vars.js";
import sendgrid from "@sendgrid/mail";
import fs from "fs";
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import createResponse from "./response_envelope.js";

const API_KEY =
  "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";

export const send_email = async (
  to: string,
  subject: string,
  text: string,
  name: string,
  path?: string,
) => {
  sendgrid.setApiKey(API_KEY);
  const msg: any = {
    to,
    from: "noreply@theatreke.com",
    subject,
    text,
    html: HTML_TEMPLATE(text, subject, name),
  };
  await sendgrid.send(msg);
};
export const send_email_with_attachment = (
  to: string[],
  subject: string,
  text: string,
  name: string,
  pdf: string,
) => {
  sendgrid.setApiKey(API_KEY);
  fs.readFile(pdf, (err, data) => {
    if (err) {
      logger.error(err.message);
      to.map((email) => {
        send_email(
          email,
          "Instructions for ticket retrieval",
          "Your ticket was saved on the system, but there was an issue sending the email, kindly contact support for assistance or verify using your name on the entry list at the event",
          name,
        );
      });
    }
    if (data) {
      const attachments = [
        {
          content: data.toString("base64"),
          filename: "ticket.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ];
      const msg = {
        to,
        from: "noreply@theatreke.com",
        subject,
        html: HTML_TEMPLATE(text, subject, name),
        attachments,
      };
      sendgrid.send(msg);
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
