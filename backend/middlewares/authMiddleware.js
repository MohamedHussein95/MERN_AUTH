import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/UserModel.js';
import dotenv from 'dotenv';
dotenv.config();
const protect = asyncHandler(async (req, res, next) => {
	let token = null;
	token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.userId).select(
				'-password -cloudinary_id -verificationToken -resetCode -__v'
			);
			next();
		} catch (error) {
			res.status(401);
			throw new Error('Not authorized,invalid token!');
		}
	} else {
		res.status(401);
		throw new Error('Not authorized,no token!');
	}
});

export { protect };
