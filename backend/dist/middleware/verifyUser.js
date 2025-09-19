import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants.js";
import User from "../models/User.js";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.signedCookies[`${COOKIE_NAME}`];
        if (!token || token.trim() === "")
            return res.status(401).json({ message: "Unverified - Token Not Found" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unverified - User not found" });
        }
        console.log("User found in Protect Route Middleware ", user);
        res.locals.user = user;
        return next();
    }
    catch (error) {
        console.log("Error in Protect route MiddleWare ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=verifyUser.js.map