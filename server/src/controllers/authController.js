import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';

const registerUser = async (req, res) => {
    try{
        const { fullName, email, password, phone, address } = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", err });
    }
};

const loginUser = async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL, role: "admin" });

            if (!adminUser) {
                
                const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
                adminUser = await User.create({
                    fullName: "Admin",
                    email: process.env.ADMIN_EMAIL,
                    password: hashedAdminPassword,
                    role: "admin",
                });
            }

            token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
            return res.status(200).json({
                _id: adminUser._id,
                fullName: adminUser.fullName,
                email: adminUser.email,
                phone: "",
                address: "",
                role: "admin",
                token,
            });
        }
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
            return res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

const createAgent = async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please fill in all required fields" });
        }
        const UserExists = await User.findOne({ email });
        if(UserExists){
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const agent= await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
            role: "agent"
        });

        if(agent){
            res.status(201).json({
                message: "Agent created successfully",
                agent: {
                    _id: agent._id,
                    fullName: agent.fullName,
                    email: agent.email,
                    phone: agent.phone,
                    address: agent.address,
                    role: agent.role
                }
            });
        }else{
            res.status(400).json({ message: "Invalid agent data" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error creating agent", err });
    }
};

const getAgent = async (req, res) => {
    try{
        const agent = await User.find({role: "agent"}).select("-password");
        res.status(200).json({
            count: agent.length,
            agents: agent
        });
    }catch(err){
        res.status(500).json({ message: "Error fetching agents", err });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullName !== undefined) user.fullName = fullName;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;

        await user.save();

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", err });
    }
};

export { registerUser, loginUser, createAgent, getAgent, updateProfile };