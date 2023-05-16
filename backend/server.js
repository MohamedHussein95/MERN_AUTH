import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import cors from 'cors';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

connectDb();

if (process.env.NODE_ENV === 'production') {
	const __dirname = path.resolve();

	app.use(express.static(path.join(__dirname, 'frontend/dist')));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
	);
} else {
	app.get('/', (req, res) => {
		res.status(200).json({ msg: 'server is ready' });
	});
}

app.use('/api/users', userRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`app listening on port :${port}`));
