import { Resend } from "resend";
import { ENV } from "./env.js";
dotenv.config();
console.log("NAME:", ENV.EMAIL_FROM_NAME);
console.log("EMAIL:", ENV.EMAIL_FROM);

export const resendClient = new Resend(ENV.RESEND_API_KEY);

export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};
