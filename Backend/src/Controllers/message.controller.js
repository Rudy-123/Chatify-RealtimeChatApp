import Message from "../Models/message.js";
import User from "../Models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredusers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); //returns everything except password
    res.status(200).json(filteredusers);
  } catch (error) {
    console.log("Error in getAllContacts", error);
    res.status(500).json({ message: "Server Error" });
  }
};
//get the chat between the currently logged user and the one whose chat is clicked so take userid from the url params
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: usertoChatId } = req.params;
    //load both the type of messages a sent to b or b sent to a
    //hence both senderid and receiver has myid i.e id of logged in user and usertoChatid each once
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: usertoChatId },
        { senderId: usertoChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//fetch only the users with whom we have messages with not the ones only present in the contacts and whom we have no messages with
//so for this find all the messages from the DB where either we r the senders or we r the receivers
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //find all the messages from the DB where either loggedinuser is the sender or loggedinuser is the receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartnerIds = [
      ...new Set( //for duplicates set used as there can be duplicates
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];
    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user is the sender of the message
    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    // Notify the receiver
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
