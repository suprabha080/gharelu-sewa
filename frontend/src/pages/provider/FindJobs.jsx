import React, { useState } from 'react';
import { Search, MapPin, Clock, Zap, Filter, CheckCircle, DollarSign, Wrench, Sparkles, Wind } from 'lucide-react';
import Card from '../../components/Card';

const openJobs = [
  {
    id: 1,
    title: 'Pipe Leak Under Kitchen Sink',
    category: 'Plumbing',
    emoji: '🔧',
    customerName: 'Sunita Sharma',
    location: 'Lakeside, Pokhara',
    postedAgo: '5 min ago',
    budget: 'Rs. 600 – 900',
    urgency: 'urgent',
    description: 'Water is leaking under the kitchen sink, needs urgent repair. Pipe seems cracked.',
    distance: '1.2 km',
  },
  {
    id: 2,
    title: 'Full Home Deep Clean (3BHK)',
    category: 'Cleaning',
    emoji: '🧹',
    customerName: 'Bikash Karki',
    location: 'Bagar, Pokhara',
    postedAgo: '15 min ago',
    budget: 'Rs. 1,500 – 2,000',
    urgency: 'normal',
    description: 'Need thorough deep cleaning of 3 bedroom flat including kitchen and bathrooms.',
    distance: '2.5 km',
  },
  {
    id: 3,
    title: 'AC Gas Refilling',
    category: 'AC Service',
    emoji: '❄️',
    customerName: 'Mira Thapa',
    location: 'Newroad, Pokhara',
    postedAgo: '25 min ago',
    budget: 'Rs. 800 – 1,200',
    urgency: 'normal',
    description: 'My 1.5 ton split AC is not cooling. Probably needs gas refilling.',
    distance: '3.1 km',
  },
  {
    id: 4,
    title: 'Switchboard Not Working',
    category: 'Electrical',
    emoji: '⚡',
    customerName: 'Ramesh Poudel',
    location: 'Chipiyata, Pokhara',
    postedAgo: '40 min ago',
    budget: 'Rs. 400 – 700',
    urgency: 'urgent',
    description: 'One switchboard in the bedroom has completely stopped working. Sparks visible.',
    distance: '0.8 km',
  },
  {
    id: 5,
    title: 'Bathroom Tile Scrubbing',
    category: 'Cleaning',
    emoji: '🧹',
    customerName: 'Priya Adhikari',
    location: 'Mahendrapul, Pokhara',
    postedAgo: '1 hr ago',
    budget: 'Rs. 400 – 600',
    urgency: 'normal',
    description: 'Two bathrooms need thorough scrubbing and disinfection.',
    distance: '4.0 km',
  },
  {
    id: 6,
    title: 'New Light Fitting in Hall',
    category: 'Electrical',
    emoji: '⚡',
    customerName: 'Gopal Shrestha',
    location: 'Prithvichowk, Pokhara',
    postedAgo: '2 hrs ago',
    budget: 'Rs. 300 – 500',
    urgency: 'normal',
    description: 'Need to install 3 new LED panel lights in the living room.',
    distance: '5.5 km',
  },
];

const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'AC Service'];
const urgencyOptions = ['All', 'urgent', 'normal'];

export default function FindJobs() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [acceptedJobs, setAcceptedJobs] = useState([]);

  const filtered = openJobs.filter((job) => {
    const matchCat = activeCategory === 'All' || job.category === activeCategory;
    const matchUrgency = urgencyFilter === 'All' || job.urgency === urgencyFilter;
    const matchSearch =
      search === '' ||
      `${job.title} ${job.location} ${job.description}`.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchUrgency && matchSearch;
  });

  const handleAccept = (jobId) => {
    setAcceptedJobs((prev) => [...prev, jobId]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">Find Jobs Near You</h1>
          <p className="text-sm text-gray-500 mt-1">Browse open service requests from customers in your area</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-[#07535f] focus-within:ring-1 focus-within:ring-[#07535f]">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by job title, location, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full text-sm text-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#07535f] cursor-pointer"
            >
              <option value="All">All Urgency</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="normal">🟢 Normal</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#07535f] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-[#07535f]">{openJobs.length}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Open Jobs</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-red-500">{openJobs.filter(j => j.urgency === 'urgent').length}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Urgent</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-green-600">{acceptedJobs.length}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Accepted by You</p>
          </div>
        </div>

        {/* Job Listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-lg font-bold text-gray-700">No jobs found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setUrgencyFilter('All'); }}
              className="mt-4 px-4 py-2 text-sm font-bold text-[#07535f] border border-[#07535f] rounded-xl hover:bg-[#07535f]/5 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => {
              const isAccepted = acceptedJobs.includes(job.id);
              return (
                <Card key={job.id} className="p-5 border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {job.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                        {job.urgency === 'urgent' && (
                          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                            <Zap className="w-3 h-3" /> Urgent
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mb-2 font-medium">{job.category} • Posted {job.postedAgo}</p>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#07535f]" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {job.distance} away
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[#07535f]">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.budget}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex sm:flex-col gap-2 sm:items-end sm:justify-between sm:min-w-[130px]">
                      <p className="text-[10px] text-gray-400 font-semibold hidden sm:block">Customer</p>
                      <p className="text-sm font-bold text-gray-800 hidden sm:block">{job.customerName}</p>

                      {isAccepted ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-xs">
                          <CheckCircle className="w-4 h-4" />
                          Accepted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAccept(job.id)}
                          className="px-5 py-2.5 bg-[#07535f] hover:bg-[#06424b] text-white rounded-xl font-bold text-sm transition-all shadow-sm whitespace-nowrap"
                        >
                          Accept Job
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
