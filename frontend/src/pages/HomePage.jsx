import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Wrench, Star, Zap } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const getRolePath = () => {
      switch (user?.role) {
        case 'customer':
          return '/customer';
        case 'provider':
          return '/provider';
        case 'admin':
          return '/admin';
        default:
          return '/';
      }
    };

    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h1>
          <p className="text-xl text-gray-600 mb-8">Continue to your dashboard</p>
          <Link
            to={getRolePath()}
            className="inline-block px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-20">
        <div className="page-container text-center">
          <div className="inline-block w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center mb-6">
            <Home className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Gharelu Sewa</h1>
          <p className="text-xl mb-8 opacity-90">Bringing Reliable Service to Your Doorstep</p>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Connect with trusted local service providers for all your household needs. 
            From electricians to plumbers, tutors to technicians – get quality service, fast.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-primary-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="page-container py-16">
        <h2 className="section-title text-center">Why Choose Gharelu Sewa?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
            <p className="text-gray-600">All service providers are verified and rated by customers</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
            <p className="text-gray-600">Book services in minutes with our simple and intuitive platform</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wide Range</h3>
            <p className="text-gray-600">Find providers for all types of household services</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="page-container text-center">
          <h2 className="section-title">Ready to Find Your Service Provider?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied customers</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-semibold"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
