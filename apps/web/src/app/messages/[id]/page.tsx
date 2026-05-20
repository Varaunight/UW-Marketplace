'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';
import { Message } from '@uw-marketplace/shared';
import SafetyBanner from '@/components/ui/SafetyBanner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (!session) return;

    apiClient(session.accessToken).get<Message[]>(`/conversations/${conversationId}/messages`).then(setMessages).finally(() => setLoading(false));
    apiClient(session.accessToken).patch(`/conversations/${conversationId}/read`, {});

    const socket = io(API_URL, { auth: { token: session.accessToken }, transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.emit('join_conversation', conversationId);
    socket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      apiClient(session.accessToken).patch(`/conversations/${conversationId}/read`, {});
    });

    return () => { socket.emit('leave_conversation', conversationId); socket.disconnect(); };
  }, [session, status, conversationId, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !session) return;
    const text = body.trim();
    setBody('');
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', { conversationId, body: text });
    } else {
      const msg = await apiClient(session.accessToken).post<Message>(`/conversations/${conversationId}/messages`, { body: text });
      setMessages((prev) => [...prev, msg]);
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-muted text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem)] bg-surface dark:bg-transparent">
      <SafetyBanner storageKey="uw-chat-safety-dismissed" />
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === session?.userId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                isMe ? 'bg-gold text-black rounded-br-none' : 'bg-surface border border-border text-fg rounded-bl-none'
              }`}>
                {!isMe && <p className="text-xs font-medium text-muted mb-1">{msg.senderName}</p>}
                <p>{msg.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-border">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted"
        />
        <button type="submit" disabled={!body.trim()} className="bg-gold hover:bg-gold-dark text-black font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
