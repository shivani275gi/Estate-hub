import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PropertyMap from '../components/PropertyMap';
import ChatBox from '../components/ChatBox';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatTarget, setChatTarget] = useState({ id: null, name: '' });

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
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await fetch(`[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/properties/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProperty(data);

        const queryParams = new URLSearchParams(location.search);
        const buyerId = queryParams.get('buyerId');
        const buyerName = queryParams.get('buyerName');

        const ownerId = data.owner?._id || data.owner?.id || data.owner;
        const isOwner = String(ownerId) === String(currentUserId);

        if (isOwner && buyerId) {
          setChatTarget({ id: buyerId, name: buyerName || 'Buyer' });
          setShowChat(true);
        } else {
          setChatTarget({ id: ownerId, name: data.owner?.username || 'Owner' });
        }
      }
    } catch (err) {
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Property deleted successfully');
        navigate('/properties');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 font-medium">Loading details...</div>;
  }

  if (!property) {
    return <div className="p-12 text-center text-slate-400 font-medium">Property not found.</div>;
  }

  const ownerId = property.owner?._id || property.owner?.id || property.owner;
  const isOwner = String(ownerId) === String(currentUserId);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {property.propertyType || 'Apartment'}
          </span>
          <h1 className="text-3xl font-black text-slate-800 mt-2">{property.title}</h1>
          <p className="text-xs text-slate-500 mt-1">📍 {property.location || property.city}</p>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
          >
            🗑️ Delete Property
          </button>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Image */}
          {property.imageUrl && (
            <div className="rounded-3xl overflow-hidden border border-slate-200 h-64 md:h-80 shadow-sm">
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
            <p className="text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-200">
              {property.description || 'No description provided.'}
            </p>
          </div>

          {/* Map */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              📍 Property Location Map
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <PropertyMap
                lat={property.lat || 19.0760}
                lng={property.lng || 72.8777}
                title={property.title}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {property.listingType === 'Sale' ? 'Selling Price' : 'Monthly Rent'}
            </span>
            <span className="text-2xl font-black text-slate-900">
              ₹{Number(property.price).toLocaleString('en-IN')}
            </span>
          </div>

          {!isOwner ? (
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow"
            >
              {showChat ? 'Close Chat' : '💬 Chat with Owner'}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-slate-50 text-slate-600 text-xs font-medium py-3 px-4 rounded-xl text-center border border-slate-100">
                👑 You are the owner of this listing
              </div>
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow"
              >
                {showChat ? 'Close Reply Box' : '💬 Open Reply Box'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating ChatBox */}
      {showChat && (
        <ChatBox
          propertyId={property._id}
          ownerId={chatTarget.id || ownerId}
          ownerName={chatTarget.name || (isOwner ? 'Buyer' : property.owner?.username)}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default PropertyDetails;