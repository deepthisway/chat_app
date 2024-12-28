import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
    // Generate the token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set the cookie
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};

export default generateToken;
