import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDb = async () => {
	try {
		const db = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Mongo Db connected : ${db.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

export default connectDb;
