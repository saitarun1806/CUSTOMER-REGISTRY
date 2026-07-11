import jwt from "jsonwebtoken";
import User from "../models/User.js";


const auth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Not authorized, no token" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }
            next();
        } catch (err) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

const adminOnly = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        res.status(401).json({ message: "Not authorized, admin only" });
    }
};

const agentOrAdmin = (req,res,next)=>{
    if(req.user && (req.user.role === "admin" || req.user.role === "agent")){
        next();
    }else{
        res.status(401).json({ message: "Not authorized, agent or admin only" });
    }
};

export {auth, adminOnly, agentOrAdmin};
