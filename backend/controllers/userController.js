import asyncHandler from 'express-async-handler';
import { User } from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';

//@desc  Auth user/set token
//route POST  api/users/auth
//@access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);

	const user = await User.findOne({ email });

	if (user && (await user.comparePasswords(password))) {
		generateToken(res, user._id);
		const {
			password,
			cloudinary_id,
			verificationToken,
			resetCode,
			__v,
			...rest
		} = user._doc;
		res.status(200).json(rest);
	} else {
		res.status(401);
		throw new Error('Invalid email or password!');
	}
});

//@desc  Register a new user
//route POST  api/users/register
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	console.log(req.body);

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists!');
	}

	const user = await User.create({
		firstName,
		lastName,
		fullName: `${firstName} ${lastName}`,
		email,
		password,
	});

	if (user) {
		generateToken(res, user._id);
		const { password, __v, ...rest } = user._doc;
		res.status(200).json(rest);
	} else {
		res.status(400);
		throw new Error('Invalid user data!');
	}
});

//@desc  logout user
//route POST  api/users/logout
//@access  Public
const logOutUser = asyncHandler(async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({ msg: 'User logged out' });
});

//@desc  Get user
//route GET  api/users/profile
//@access  private
const getUserProfile = asyncHandler(async (req, res) => {
	//console.log(req.user);
	res.status(200).json(req.user);
});

//@desc  Update user profile
//route PUT  api/users/profile
//@access  private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(404);
		throw new Error('User not found!');
	}

	const { firstName, lastName, password } = req.body;
	user.firstName = firstName || user.firstName;
	user.lastName = lastName || user.lastName;
	user.fullName =
		firstName && lastName
			? `${firstName} ${lastName}`
			: firstName
			? `${firstName} ${user.lastName}`
			: lastName
			? `${user.firstName} ${lastName}`
			: user.fullName;
	if (password) {
		user.password = password;
	}

	const updatedUser = await user.save();
	const {
		password: p,
		cloudinary_id,
		verificationToken,
		resetCode,
		__v,
		...rest
	} = updatedUser._doc;
	res.status(200).json(rest);
});

export {
	authUser,
	registerUser,
	logOutUser,
	getUserProfile,
	updateUserProfile,
};
