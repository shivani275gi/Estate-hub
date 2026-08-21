import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    listingType: 'Sale',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      setLoading(true);

      // 1. Fetch exact Lat/Lng from Location text (OpenStreetMap API)
      let latitude = 22.7196; // Indore default fallback
      let longitude = 75.8577;

      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }

      // 2. Send payload with dynamic lat & lng
      const payload = {
        ...formData,
        price: Number(formData.price),
        lat: latitude,
        lng: longitude
      };

      const res = await fetch('[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Property added successfully with exact map coordinates!');
        navigate(`/properties/${data._id || ''}`);
      } else {
        alert(data.message || 'Failed to add property');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while adding property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mt-6">
      <h1 className="text-2xl font-black text-slate-800 mb-4">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. 2 BHK Luxury Flat"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Location / Address</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Vijay Nagar, Indore"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 4500000"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Listing Type</label>
            <select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Property description..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition shadow"
        >
          {loading ? 'Finding location on Map & Saving...' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
}

export default AddProperty;