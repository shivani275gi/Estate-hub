import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) {
      params.append('location', location.trim());
    }
    if (propertyType !== 'All Types') {
      params.append('type', propertyType);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Dark Navy Hero Section */}
      <div className="bg-[#122e68] text-white pt-24 pb-36 px-4 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Find Your Dream Home With <br />
          <span className="text-[#3b82f6]">Ease</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-lg mt-5 font-normal leading-relaxed">
          Explore premium apartments, villas, and commercial properties available for <br className="hidden md:block" /> buy and rent.
        </p>

        {/* Rounded Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-10 bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 w-full max-w-2xl border border-slate-100"
        >
          <input
            type="text"
            placeholder="Enter Location / City (e.g. mumbai)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 text-xs md:text-sm text-slate-700 outline-none bg-transparent placeholder-slate-400"
          />

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-xs md:text-sm text-slate-600 outline-none bg-transparent cursor-pointer font-medium border-t sm:border-t-0 sm:border-l border-slate-100"
          >
            <option value="All Types">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="Studio">Studio</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#1d61f2] hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-8 py-3 rounded-xl transition shadow"
          >
            Search
          </button>
        </form>
      </div>

      {/* 3 Feature Boxes */}
      <div className="max-w-5xl mx-auto px-4 -mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-2">
          <div className="text-3xl">🏢</div>
          <h3 className="font-bold text-sm text-slate-800">Verified Listings</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every property listed on EstateHub goes through verification
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-2">
          <div className="text-3xl">🤝</div>
          <h3 className="font-bold text-sm text-slate-800">Direct Contact</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Connect directly with owners and trusted agents
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-2">
          <div className="text-3xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-800">Fast Deals</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Get instant responses and close deals faster
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;