import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Clock, Filter, X } from 'lucide-react';

const providers = [
  {
    id: 1,
    name: 'Rajesh Plumbing Works',
    category: 'Plumbing',
    rating: 4.9,
    reviews: 142,
    price: 'Rs. 500',
    priceUnit: 'per visit',
    location: 'Baneshwor',
    responseTime: '~15 min',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=220&fit=crop',
    tags: ['Pipe Leak', 'Installation', 'Drainage'],
    verified: true,
    available: true,
  },
  {
    id: 2,
    name: 'BrightSpark Electricals',
    category: 'Electrical',
    rating: 4.7,
    reviews: 89,
    price: 'Rs. 700',
    priceUnit: 'per visit',
    location: 'Lazimpat',
    responseTime: '~25 min',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop',
    tags: ['Rewiring', 'Fan Install', 'Short Circuit'],
    verified: true,
    available: true,
  },
  {
    id: 3,
    name: 'CleanNest Home Services',
    category: 'Cleaning',
    rating: 4.8,
    reviews: 215,
    price: 'Rs. 1,200',
    priceUnit: 'per session',
    location: 'Thamel',
    responseTime: '~1 hr',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=220&fit=crop',
    tags: ['Deep Clean', 'Kitchen', 'Bathroom'],
    verified: true,
    available: true,
  },
  {
    id: 4,
    name: 'ArtWork Painters',
    category: 'Painting',
    rating: 4.6,
    reviews: 58,
    price: 'Rs. 800',
    priceUnit: 'per room',
    location: 'Baluwatar',
    responseTime: '~2 hrs',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=220&fit=crop',
    tags: ['Interior', 'Exterior', 'Texture'],
    verified: false,
    available: true,
  },
  {
    id: 5,
    name: 'WoodCraft Carpentry',
    category: 'Carpentry',
    rating: 4.5,
    reviews: 73,
    price: 'Rs. 900',
    priceUnit: 'per visit',
    location: 'Patan',
    responseTime: '~30 min',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=220&fit=crop',
    tags: ['Furniture Fix', 'Door Repair', 'Shelving'],
    verified: true,
    available: false,
  },
  {
    id: 6,
    name: 'CoolAir AC Technicians',
    category: 'AC Repair',
    rating: 4.9,
    reviews: 102,
    price: 'Rs. 600',
    priceUnit: 'per visit',
    location: 'Koteshwor',
    responseTime: '~20 min',
    image: 'https://images.unsplash.com/photo-1631983564532-ef40dd6e9a5d?w=400&h=220&fit=crop',
    tags: ['AC Service', 'Gas Refill', 'Installation'],
    verified: true,
    available: true,
  },
  {
    id: 7,
    name: 'StyleStitch Tailoring',
    category: 'Tailoring',
    rating: 4.4,
    reviews: 41,
    price: 'Rs. 350',
    priceUnit: 'per piece',
    location: 'Kalanki',
    responseTime: '~1 hr',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop',
    tags: ['Stitching', 'Alteration', 'Uniform'],
    verified: false,
    available: true,
  },
  {
    id: 8,
    name: 'GreenShield Pest Control',
    category: 'Pest Control',
    rating: 4.7,
    reviews: 64,
    price: 'Rs. 1,500',
    priceUnit: 'per session',
    location: 'Maharajgunj',
    responseTime: '~45 min',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=220&fit=crop',
    tags: ['Cockroach', 'Rodents', 'Bed Bugs'],
    verified: true,
    available: false,
  },
  {
    id: 9,
    name: 'FixAll General Services',
    category: 'Plumbing',
    rating: 4.3,
    reviews: 33,
    price: 'Rs. 400',
    priceUnit: 'per visit',
    location: 'Baneshwor',
    responseTime: '~35 min',
    image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=220&fit=crop',
    tags: ['Tap Repair', 'Tank Fill', 'Drain'],
    verified: true,
    available: true,
  },
];

const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry', 'AC Repair', 'Tailoring', 'Pest Control'];

const locationOptions = [
  { value: '', label: 'All Locations' },
  { value: 'Baneshwor', label: 'Baneshwor, KTM' },
  { value: 'Thamel', label: 'Thamel, KTM' },
  { value: 'Lazimpat', label: 'Lazimpat, KTM' },
  { value: 'Patan', label: 'Patan, Lalitpur' },
  { value: 'Koteshwor', label: 'Koteshwor, KTM' },
  { value: 'Lakeside', label: 'Lakeside, Pokhara' },
  { value: 'Newroad', label: 'Newroad, Pokhara' },
];

export default function FindJobs() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);

  const filtered = providers.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchLoc = location === '' || p.location.toLowerCase().includes(location.toLowerCase());
    const matchSearch =
      search === '' ||
      `${p.name} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase());
    const matchAvail = !availableOnly || p.available;
    const matchVerified = !verifiedOnly || p.verified;
    const priceNum = parseInt(p.price.replace(/[^0-9]/g, ''));
    const matchPrice = priceNum <= maxPrice;
    return matchCat && matchLoc && matchSearch && matchAvail && matchVerified && matchPrice;
  });

  const clearFilters = () => {
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setMaxPrice(2000);
    setSearch('');
    setLocation('');
    setActiveCategory('All');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Teal Hero Search Header */}
      <div className="bg-[#07535f] px-4 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-5">Find Services Near You</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search plumber, electrician..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm min-w-[200px]">
              <MapPin className="w-5 h-5 text-[#07535f] shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 cursor-pointer appearance-none"
              >
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#07535f] text-white border-[#07535f] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#07535f] hover:text-[#07535f]'
              }`}
            >
              {cat === 'Plumbing' && '🔧'}
              {cat === 'Electrical' && '⚡'}
              {cat === 'Cleaning' && '🧹'}
              {cat === 'Painting' && '🎨'}
              {cat === 'Carpentry' && '🪚'}
              {cat === 'AC Repair' && '❄️'}
              {cat === 'Tailoring' && '🧵'}
              {cat === 'Pest Control' && '🪲'}
              {cat === 'All' && '✨'}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 flex gap-6">

        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-36">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <button onClick={clearFilters} className="text-[10px] text-[#07535f] font-bold hover:underline">
                Clear
              </button>
            </div>

            {/* Availability */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Availability</p>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 text-[#07535f] rounded focus:ring-[#07535f] border-gray-300"
                />
                Available Now Only
              </label>
            </div>

            {/* Verification */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Verification</p>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-[#07535f] rounded focus:ring-[#07535f] border-gray-300"
                />
                Verified Only
              </label>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Price Range</p>
              <p className="text-xs text-gray-500 mb-2">Rs. 0 – Rs. {maxPrice.toLocaleString()}</p>
              <input
                type="range"
                min={200}
                max={2000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#07535f]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Rs. 200</span>
                <span>Rs. 2,000</span>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="mt-5 w-full text-xs font-bold text-gray-500 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Provider Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-semibold mb-4">
            <span className="text-gray-800 font-bold">{filtered.length} providers</span> available
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-lg font-bold text-gray-700">No providers found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm font-bold text-[#07535f] border border-[#07535f] rounded-xl hover:bg-[#07535f]/5 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Cover Image */}
                  <div className="relative h-36 bg-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {p.verified && (
                        <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#07535f] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#07535f]/20">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.available
                          ? 'bg-[#10b981] text-white'
                          : 'bg-gray-400 text-white'
                      }`}>
                        {p.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Name + Price */}
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{p.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-sm font-black text-[#07535f]">{p.price}</p>
                        <p className="text-[10px] text-gray-400">{p.priceUnit}</p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 my-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-700 font-bold">{p.rating}</span>
                        <span className="text-gray-400">({p.reviews})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {p.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {p.responseTime}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.tags.map(tag => (
                        <span key={tag} className="bg-gray-50 border border-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Book Now Button */}
                    <Link
                      to={`/book?category=${encodeURIComponent(p.category)}`}
                      className="block w-full bg-[#07535f] hover:bg-[#06424b] text-white font-bold text-sm py-2.5 rounded-xl text-center transition-all shadow-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
