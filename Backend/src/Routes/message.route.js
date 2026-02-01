import express from "express";
import { getAllContacts } from "../Controllers/message.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { getMessagesByUserId } from "../Controllers/message.controller.js";
import { sendMessage } from "../Controllers/message.controller.js";
import { getChatPartners, deleteMessage } from "../Controllers/message.controller.js";
import { arcjetProtection } from "../Middleware/arcjet.middleware.js";

const router = express.Router();

//the middlewares execute in order-so requests get rate limited first and then authenticated
//this is more efficient way as unauthenticated requests if any get blocked before hitting the auth middleware
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts); //list of contacts
router.get("/chats", getChatPartners); //list of all the ones whom we had chat with
router.get("/:id", getMessagesByUserId); //if we click any user we get that chat so route is configured by the id of the user
router.post("/send/:id", sendMessage); //for sending any message with the user id of the receiver
router.delete("/delete/:id", deleteMessage);


export default router;
