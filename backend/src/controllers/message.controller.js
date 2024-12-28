import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req,res) =>  {
    try {
        const loggedInUser = req.user._id;
        // ne = not equal, Find all users not having id equal to the loggedin userID
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("fullName email");
        
        res.status(200).json(filteredUsers)
    } catch (error) {
    console.error("Error in getting users for sidebar:", error); 
    res.status(500).json({
        msg: "Internal server error in getting users for sidebar"
    })
}
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId }= req.params;
        const myId = req.user._id;

        const messages  = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getting messages:", error);
        res.status(500).json({
            msg: "Internal server error in getting messages"
        })
    }
}

export const sendMessage = async (req,res) =>   {
    try {
        const {text, image} =req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        // console.log("senderId:", senderId);
        // console.log("receiverId:", receiverId);
    
        if (!text && !image) {
            return res.status(400).json({ msg: "Message text or image is required" });
          }

        let imageUrl = null;
        if(image)   {
            console.log("Entered cloudinary");
            
            const uploadResponse = await cloudinary.uploader.upload(image); // returns an object having the uplloaded image url;
            console.log("passed cloudinary upload");
            imageUrl = uploadResponse.url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text,
            image: imageUrl
        })

        await newMessage.save();

        //todo : real-time functionality goes here;
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({
            error: error,
            msg: "Internal server error in sending message"
        })
    }
}
