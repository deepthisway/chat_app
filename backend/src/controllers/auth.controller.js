import User from "../models/user.model.js";
import generateToken from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // console.log("sign up is hit!!");

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        msg: "user already exist with this email!!",
      });
    }
    // saltin the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newUser._id, res);

    await newUser.save();
    res.json({
      msg: "Signup successfull!!",
      _id: newUser._id,
      Name: newUser.fullName,
      token: token,
    });
  } catch (error) {
    console.error("Signup Error:", error); // Log the error
    return res
      .status(500)
      .json({ msg: "Internal server error during signup!" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); 
    // console.log("user is:", user);
    // always keep in curly braces
    if (!user) {
      res.json({
        msg: "User not found with this email!!",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.json({
        msg: "Invalid password!!",
      });
    }
    const token = generateToken(user._id, res);
    res.json({
      msg: "Signin successful",
      token: token,
    });
  } catch (error) {
    res.json({
      msg: "Error in siging in!!",
    });
  }
};

export const signout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({
      msg: "Logged out successfully!!",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error in logging out!!",
    });
  }
};

// protected route
export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
  
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized: Please log in first" });
      }
  
      const userId = req.user._id;
  
      // Validate profile picture input
      if (!profilePic) {
        return res.status(400).json({ msg: "Please upload a profile picture" });
      }
  
      // Upload the profile picture to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "user_profiles",
      });
  
      if (!uploadResponse.secure_url) {
        return res.status(500).json({ msg: "Error in uploading to Cloudinary" });
      }
  
      // Update the user's profile picture in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      // Respond with success and the updated user data
      res.json({
        msg: "Profile updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.error("Error in updateProfile:", error.message);
      res.status(500).json({
        msg: "Error in updating profile",
        error: error.message, // Include error details (remove in production)
      });
    }
  };
  
// calls everrtime we refresh our appliucation

export const checkAuth = (req, res) => {
  try {
    // console.log("Entered checkAuth fxn at backend");

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth!!", error);
    res.status(500).json({ msg: "Internal server error in checkAuth!!" });
  }
};
