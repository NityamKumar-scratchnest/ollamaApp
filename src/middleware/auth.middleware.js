import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ msg: "No token" });
    }

    // REMOVE "Bearer "
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];    
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRATE);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(403).json({ msg: "Unauthorized" });
    }
};