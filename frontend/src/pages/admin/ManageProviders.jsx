import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getPendingProviders();
      // Ensure we treat the response correctly whether it is nested in `.data` or is the array itself
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setProviders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending providers.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.verifyProvider(id);
      setProviders(providers.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to verify provider');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this provider?')) return;
    try {
      await adminAPI.rejectProvider(id, { reason: 'Failed KYC verification' });
      setProviders(providers.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to reject provider');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-[#07535f]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Manage Providers</h1>
          <p className="text-sm text-gray-500">Approve or reject pending KYC applications.</p>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">{error}</div>}

      <Card className="overflow-hidden border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Provider Info</th>
                <th className="p-4">Service Category</th>
                <th className="p-4">Citizenship / License No</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No pending providers to verify! 🎉</td>
                </tr>
              ) : (
                providers.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {p.avatar_url ? (
                            <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#07535f]/10 flex items-center justify-center text-[#07535f] font-bold">
                              {p.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.email} • {p.phone || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{p.ward || 'Unknown location'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#07535f]/10 text-[#07535f] font-bold text-xs px-2.5 py-1 rounded-full">
                        {p.service_category || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        {p.citizenship_no || <span className="text-gray-400 italic font-sans text-xs">Not Provided</span>}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {p.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(p.id)}
                          className="flex items-center gap-1 bg-[#10b981] hover:bg-[#0ea572] text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button 
                          onClick={() => handleReject(p.id)}
                          className="flex items-center gap-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
