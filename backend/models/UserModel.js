import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		cloudinary_id: {
			type: String,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
		},
		resetCode: { type: String },
	},
	{
		timestamps: true,
	}
);
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePasswords = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', UserSchema);

export { User };
