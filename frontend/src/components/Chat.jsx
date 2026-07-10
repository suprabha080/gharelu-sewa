import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { messageAPI } from '../services/api';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function Chat({ bookingId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    fetchMessages();
    
    const socket = getSocket();
    if (socket) {
      socket.emit('join_booking', bookingId);
      
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave_booking', bookingId);
        socket.off('receive_message');
      }
    };
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await messageAPI.getBookingMessages(bookingId);
      const data = Array.isArray(res.data) ? res.data : [];
      const transformed = data.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name || 'User',
        content: m.content,
        timestamp: m.sent_at
      }));
      setMessages(transformed);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      // 1. Add to local state immediately (optimistic)
      const localMsg = {
        id: `local-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        content: messageText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, localMsg]);

      // 2. Save to DB
      await messageAPI.sendMessage({
        booking_id: bookingId,
        content: messageText
      });

      // 3. Emit to socket (for other party)
      const socket = getSocket();
      if (socket) {
        socket.emit('send_message', {
          bookingId,
          message: messageText,
          senderName: user.name,
          senderId: user.id
        });
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-[500px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm">Live Chat</h3>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Online</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-xs mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user.id;
            
            return (
              <div key={msg.id || idx} className={clsx("flex flex-col", isMe ? "items-end" : "items-start")}>
                {!isMe && <span className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</span>}
                <div className={clsx(
                  "max-w-[75%] px-4 py-2 rounded-2xl text-sm",
                  isMe ? "bg-[#07535f] text-white rounded-tr-sm" : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                )}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 mx-1">
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#07535f] focus:border-[#07535f]"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-[#07535f] hover:bg-[#06424b] disabled:opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
