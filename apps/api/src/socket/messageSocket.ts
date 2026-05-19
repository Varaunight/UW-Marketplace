import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendMessage, markRead } from '../services/messages.service';

export function setupSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId: string = socket.data.userId;

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('send_message', async (data: { conversationId: string; body: string }) => {
      try {
        const message = await sendMessage(data.conversationId, userId, data.body);
        io.to(`conversation:${data.conversationId}`).emit('new_message', message);
      } catch (err) {
        socket.emit('error', { message: (err as Error).message });
      }
    });

    socket.on('mark_read', async (conversationId: string) => {
      try {
        await markRead(conversationId, userId);
        socket.to(`conversation:${conversationId}`).emit('messages_read', { conversationId, userId });
      } catch {
        // Non-fatal
      }
    });
  });
}
