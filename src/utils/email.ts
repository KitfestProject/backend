import nodemailer from "nodemailer";
import logger from "./logging.js";
import env_vars from "../config/env_vars.js";
import sendgrid from "@sendgrid/mail";
import fs from "fs";
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import createResponse from "./response_envelope.js";
import { IEvents } from "../../interfaces/index.js";
import moment from "moment";

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
  to: string,
  subject: string,
  text: string,
  name: string,
  pdf: string,
) => {
  sendgrid.setApiKey(API_KEY);
  fs.readFile(pdf, (err, data) => {
    if (err) {
      logger.error(err.message);
      send_email(
        to,
        "Instructions for ticket retrieval",
        "Your ticket was saved on the system, but there was an issue sending the email, kindly contact support for assistance or verify using your name on the entry list at the event",
        name,
      );
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
  <!doctype html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>theatreke.com email</title>
          <style>
              body {
                  font-family: "Arial", sans-serif;
                  line-height: 1.6;
                  color: #090808;
                  background-color: #f08165;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #732e1c;
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
              }
              .header p{
                color: #ffffff;
              }
              .logo {
                  max-width: 150px;
                  height: auto;
              }
              .content {
                  padding: 30px;
                  background-color: #ffffff;
              }
              .footer {
                  background-color: #1f1f1f;
                  color: #ffffff;
                  text-align: center;
                  padding: 15px;
                  font-size: 14px;
              }
              h1,
              h2 {
                  color: #b40000;
              }
              .cta-button {
                  display: inline-block;
                  background-color:#732e1c;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  margin-top: 20px;
              }
              .cta-button:hover {
                  background-color: #2f855a;
              }
              .event {
                  margin-bottom: 20px;
                  padding: 20px;
                  background-color: #f2f4ff;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .event h3 {
                  color: #732e1c;
                  margin-top: 0;
              }
              .event-image {
                  width: 100%;
                  max-height: 200px;
                  object-fit: cover;
                  border-radius: 8px;
                  margin-bottom: 15px;
              }
              .event-details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 15px;
              }
              .event-info {
                  flex: 1;
              }
              .event-actions {
                  text-align: right;
              }
              .book-button {
                  display: inline-block;
                  background-color: #b40000;
                  color: #ffffff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }
              .book-button:hover {
                  background-color: #9b2c2c;
              }
              .social-links {
                  margin-top: 20px;
              }
              .social-links a {
                  color: #f08165;
                  text-decoration: none;
                  margin: 0 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img
                      src="https://theatreke.com/assets/kitft-logo-dark-DynrISun.png"
                      alt="TheatreKe.com Logo"
                      class="logo"
                  />
                  <p>Experience the Magic of Kenyan Theatre</p>
                  <br/>
                  <p><strong>${subject}</strong></p>
              </div>
              <div class="content">
                  <p>${text}</p>
                  <br />
                  <p>
                      Don't miss out on this spectacular performance and many
                      others!
                  </p>
                  <a href="https://staging.theatreke.com/events" class="cta-button"
                      >Explore More Events</a
                  >
              </div>
              <div class="footer">
                  <p>&copy; 2024 theatreke.com. All rights reserved.</p>
                  <div class="social-links">
                      <a href="">Facebook</a>
                      <a href="">Instagram</a>
                      <a href="">Twitter</a>
                  </div>
                  <p>
                      Questions? Contact us at
                      <a
                          href="mailto:theatreke@kitfest.co.ke"
                          style="color: white; font-weight: bold;"
                          >theatreke@kitfest.co.ke</a
                      >
                  </p>
              </div>
          </div>
      </body>
  </html>`;
};
