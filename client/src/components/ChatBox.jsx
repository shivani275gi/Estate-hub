import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)', {
  transports: ['websocket', 'polling']
});

function ChatBox({ propertyId, ownerId, ownerName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const userStored = localStorage.getItem('user');
  let currentUserId = null;

  try {
    const parsed = userStored ? JSON.parse(userStored) : null;
    currentUserId = parsed?.id || parsed?._id || localStorage.getItem('userId');
  } catch (e) {
    currentUserId = localStorage.getItem('userId');
  }

  const cleanTargetId = typeof ownerId === 'object' ? (ownerId?._id || ownerId?.id) : ownerId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join the property room and listen for incoming messages
  useEffect(() => {
    if (propertyId) {
      socket.emit('join_property_chat', String(propertyId));
    }

    const handleReceiveMessage = (msg) => {
      const msgPropId = msg.property?._id || msg.property;
      if (String(msgPropId) === String(propertyId)) {
        setMessages((prev) => {
          const exists = prev.some((m) => String(m._id) === String(msg._id));
          return exists ? prev : [...prev, msg];
        });
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [propertyId]);

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token || !propertyId) return;
      try {
        const res = await fetch(`[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/messages/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Fetch history error:', err);
      }
    };

    fetchChatHistory();
  }, [propertyId, token]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    if (!newMessage.trim()) return;

    if (!token) {
      alert('Please log in first to chat');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: String(propertyId),
          receiverId: String(cleanTargetId || currentUserId),
          text: newMessage.trim()
        })
      });

      const savedMsg = await res.json();

      if (res.ok) {
        // Emit to property room so everyone in this chat sees it instantly
        socket.emit('send_message', {
          propertyId: String(propertyId),
          messageData: savedMsg
        });

        setNewMessage('');
      } else {
        alert(savedMsg.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <h3 className="font-bold text-sm">💬 {ownerName || 'Property Chat'}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-base font-bold px-2 py-0.5 rounded transition"
        >
          ✕
        </button>
      </div>

      <div className="p-4 h-72 overflow-y-auto bg-slate-50 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="text-center my-auto text-xs text-slate-400">
            No messages yet. Send a message to start!
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = typeof msg.sender === 'object' ? (msg.sender?._id || msg.sender?.id) : msg.sender;
            const isMe = String(senderId) === String(currentUserId);

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="break-words">{msg.text || msg.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {isMe ? 'You' : (msg.sender?.username || 'User')}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ChatBox;