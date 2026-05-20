import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import listingsRoutes from './routes/listings.routes';
import messagesRoutes from './routes/messages.routes';
import usersRoutes from './routes/users.routes';
import reportsRoutes from './routes/reports.routes';
import { errorHandler } from './middleware/errorHandler';
import { setupSocket } from './socket/messageSocket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.WEB_URL, credentials: true },
});

setupSocket(io);

app.use(helmet());
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/listings', listingsRoutes);
app.use('/api/v1/conversations', messagesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/reports', reportsRoutes);

app.use(errorHandler);

server.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
