import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // need to establish cookiepartser in index.js to access this;
        if(!token){
            return res.status(401).json({msg: "You need to login first"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded)    {
            return res.status(401).json({msg: "Invalid token"});
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user)   {
            return res.status(401).json({msg: "No user found with this token"});
        }
        req.user = user; //attach the user details to the request object
        
        next();

    } catch (error) {
        console.error("Error in protectedRoute:", error.message);
        res.status(500).json({ msg: "Internal server error in middleware" });
    }
    

}

