import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const locationState = useLocation();

  useEffect(() => {
    fetchProperties();
  }, [locationState.search]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Read query params from URL (/properties?location=indore)
      const params = new URLSearchParams(locationState.search);
      const loc = params.get('location');
      const type = params.get('type');

      let url = '[https://real-estate-platform-z7k5.onrender.com](https://real-estate-platform-z7k5.onrender.com)/api/properties';
      const queryParams = new URLSearchParams();
      if (loc) queryParams.append('location', loc);
      if (type && type !== 'All Types') queryParams.append('propertyType', type);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProperties(data);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedProperties = properties.filter((item) => {
    if (activeTab === 'All') return true;
    return item.listingType === activeTab;
  });

  const params = new URLSearchParams(locationState.search);
  const searchedCity = params.get('location');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Properties</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {searchedCity ? `Showing results for "${searchedCity}"` : 'Discover verified homes available for Buy and Rent'}
          </p>
        </div>

        {/* Top Right Tabs */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('Sale')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'Sale' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏷️ For Sale (Buy)
          </button>
          <button
            onClick={() => setActiveTab('Rent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'Rent' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 For Rent
          </button>
        </div>
      </div>

      {/* Grid or Empty state */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs">Searching properties...</div>
      ) : displayedProperties.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-4 shadow-sm min-h-[320px] flex flex-col items-center justify-center">
          <h3 className="text-xl font-black text-slate-800">No Properties Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {searchedCity ? `No properties listed in "${searchedCity}" yet.` : 'No listings available in this category right now.'}
          </p>
          <Link
            to="/add-property"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
          >
            + Add First Property Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedProperties.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-white ${
                      item.listingType === 'Sale' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                  >
                    {item.listingType === 'Sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.propertyType || 'Apartment'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500">📍 {item.location || item.city}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Price</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  to={`/properties/${item._id}`}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Properties;