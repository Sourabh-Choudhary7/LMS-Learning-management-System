import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import {config} from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';
config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))

app.use(cookieParser());

app.use('/ping', function(req, res) {
    res.send('/pong');
})
app.use(morgan('dev'));

//routes of 3 modules
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/courses',courseRoutes);
app.use('/api/v1/payments',paymentRoutes);

app.all('*', (req, res) => {
    res.status(404).send('Page not found');
})

app.use(errorMiddleware);

export default app;