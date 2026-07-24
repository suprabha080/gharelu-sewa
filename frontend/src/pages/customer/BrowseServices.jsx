import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function BrowseServices() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  const initialWard = queryParams.get('ward') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [ward, setWard] = useState(initialWard);
  const [activeCategory, setActiveCategory] = useState('All');

  // Dummy service categories
  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'AC Service'];

  // Dummy providers/services
  const providers = [
    {
      id: 1,
      name: 'Rajesh Shrestha',
      category: 'Plumbing',
      rating: 4.9,
      reviews: 142,
      price: 'Rs. 600/hr',
      ward: 'Lakeside',
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      description: 'Expert plumber for leak repairs and pipe installations in Pokhara.',
      tags: ['Pipe Leak', 'Tap Repair', 'Drain Cleaning']
    },
    {
      id: 2,
      name: 'Bikash Rai',
      category: 'Electrical',
      rating: 4.8,
      reviews: 95,
      price: 'Rs. 700/hr',
      ward: 'Bagar',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      description: 'Professional electrician for wiring and appliances. Pokhara based.',
      tags: ['Rewiring', 'Appliances', 'Switchboard']
    },
    {
      id: 3,
      name: 'Mira Thapa',
      category: 'Cleaning',
      rating: 4.7,
      reviews: 210,
      price: 'Rs. 500/hr',
      ward: 'Chipiyata',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
      description: 'Thorough deep cleaning and disinfection services in Pokhara.',
      tags: ['Deep Clean', 'Home Clean', 'Disinfection']
    },
    {
      id: 4,
      name: 'Sunita Gurung',
      category: 'Cleaning',
      rating: 4.9,
      reviews: 80,
      price: 'Rs. 550/hr',
      ward: 'Newroad Pokhara',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      description: 'Reliable and affordable kitchen, bathroom and room cleaning.',
      tags: ['Kitchen Clean', 'Bathroom Clean', 'Office Clean']
    },
    {
      id: 5,
      name: 'Ramesh AC Works',
      category: 'AC Service',
      rating: 4.6,
      reviews: 45,
      price: 'Rs. 800/hr',
      ward: 'Mahendrapul',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150',
      description: 'Fast AC servicing and gas refilling across Pokhara.',
      tags: ['AC Service', 'Gas Refill', 'AC Repair']
    },
    {
      id: 6,
      name: 'Hari Electricals',
      category: 'Electrical',
      rating: 4.5,
      reviews: 67,
      price: 'Rs. 650/hr',
      ward: 'Lakeside',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      description: 'Experienced electrician for homes and restaurants near Lakeside.',
      tags: ['Wiring', 'Panel Box', 'Light Fitting']
    },
    {
      id: 7,
      name: 'Sita Cleaning Services',
      category: 'Cleaning',
      rating: 4.8,
      reviews: 130,
      price: 'Rs. 480/hr',
      ward: 'Baneshwor',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      description: 'Professional home cleaning with eco-friendly products. Kathmandu.',
      tags: ['Home Clean', 'Eco Clean', 'Sofa Clean']
    },
    {
      id: 8,
      name: 'Nirmala Plumbing',
      category: 'Plumbing',
      rating: 4.7,
      reviews: 55,
      price: 'Rs. 580/hr',
      ward: 'Thamel',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      description: 'Reliable plumbing for hotels and homes in Thamel and Kathmandu.',
      tags: ['Hotel Plumbing', 'Emergency Pipe', 'Water Tank']
    }
  ];

  const filteredProviders = providers.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesWard = ward === '' || p.ward.toLowerCase().includes(ward.toLowerCase());
    const searchString = `${p.name} ${p.category} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
    const matchesQuery = searchQuery === '' || searchString.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesWard && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 font-serif mb-6">Find Professionals</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-[#07535f] focus-within:ring-1 focus-within:ring-[#07535f]">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, service, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full text-sm text-gray-700"
            />
          </div>
          <div className="flex-1 w-full flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-[#07535f] focus-within:ring-1 focus-within:ring-[#07535f]">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full text-sm text-gray-700 cursor-pointer"
            >
              <option value="">All Locations</option>
              <optgroup label="🏔 Pokhara">
                <option value="Lakeside">Lakeside, Pokhara</option>
                <option value="Newroad Pokhara">New Road, Pokhara</option>
                <option value="Chipiyata">Chipiyata, Pokhara</option>
                <option value="Bagar">Bagar, Pokhara</option>
                <option value="Mahendrapul">Mahendrapul, Pokhara</option>
                <option value="Simalchaur">Simalchaur, Pokhara</option>
                <option value="Prithvichowk">Prithvichowk, Pokhara</option>
              </optgroup>
              <optgroup label="🏙 Kathmandu Valley">
                <option value="Baneshwor">Baneshwor, Kathmandu</option>
                <option value="Thamel">Thamel, Kathmandu</option>
                <option value="Koteshwor">Koteshwor, Kathmandu</option>
                <option value="Pulchowk">Pulchowk, Lalitpur</option>
                <option value="Jawalakhel">Jawalakhel, Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
              </optgroup>
              <optgroup label="🌄 Other Cities">
                <option value="Butwal">Butwal</option>
                <option value="Biratnagar">Biratnagar</option>
                <option value="Dharan">Dharan</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#07535f] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-700">No professionals found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters or changing the location.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setWard(''); setActiveCategory('All'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <img src={provider.image} alt={provider.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{provider.category}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-700">{provider.rating}</span>
                      <span className="text-gray-400">({provider.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{provider.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Starts at</span>
                    <span className="font-bold text-[#07535f]">{provider.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=${encodeURIComponent(`/book?category=${encodeURIComponent(provider.category)}`)}`);
                      } else {
                        navigate(`/book?category=${encodeURIComponent(provider.category)}`);
                      }
                    }}
                  >
                    <Button variant="primary" size="sm" className="flex items-center gap-1">
                      Book <ArrowRight className="w-4 h-4" />
                    </Button>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
