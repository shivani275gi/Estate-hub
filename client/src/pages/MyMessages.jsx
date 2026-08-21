import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userStored = localStorage.getItem('user');
  let currentUserId = null;

  try {
    const parsedUser = userStored ? JSON.parse(userStored) : null;
    currentUserId = parsedUser?.id || parsedUser?._id || localStorage.getItem('userId');
  } catch (e) {
    currentUserId = localStorage.getItem('userId');
  }

  useEffect(() => {
    const fetchInbox = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Fetch Inbox Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-2">
          💬 My Inbox & Messages
        </h1>
        <p className="text-sm text-slate-500">Manage conversations and reply to interested tenants/buyers.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading conversations...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700">No messages in your inbox yet.</h3>
          <p className="text-xs text-slate-400">
            Messages sent or received for properties will appear here.
          </p>
          <Link
            to="/properties"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender;
            const receiverId = msg.receiver?._id || msg.receiver;
            const isSentByMe = String(senderId) === String(currentUserId);

            const otherPartyId = isSentByMe ? receiverId : senderId;
            const otherPartyName = isSentByMe ? msg.receiver?.username : msg.sender?.username;

            return (
              <div
                key={msg._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {isSentByMe ? `To: @${otherPartyName || 'User'}` : `From: @${otherPartyName || 'User'}`}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {msg.property?.title || 'Property Listing'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 break-words">{msg.text}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                {msg.property?._id && (
                  <Link
                    to={`/properties/${msg.property._id}?buyerId=${otherPartyId}&buyerName=${otherPartyName}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition text-center shrink-0"
                  >
                    Open Chat / View
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyMessages;