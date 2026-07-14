import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Check, Compass, AlertCircle, Wrench, Navigation, CheckCircle2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSocket } from '../../services/socket';

// Custom icons using Lucide
const createCustomIcon = (iconHtml, bgColor) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="background-color: ${bgColor}; color: white; padding: 8px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        ${iconHtml}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const userIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const providerIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;

const userIcon = createCustomIcon(userIconHtml, '#07535f');
const providerIcon = createCustomIcon(providerIconHtml, '#10b981');

// Component to recenter map
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LiveTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || {};

  const [currentStatus, setCurrentStatus] = useState(1);
  
  // Coordinates for Pokhara, Nepal
  const userLocation = [28.2096, 83.9856]; 
  const initialProviderLocation = [28.2200, 83.9700]; // Somewhere else in Pokhara
  
  const [providerPos, setProviderPos] = useState(initialProviderLocation);
  const [distance, setDistance] = useState(2.4);
  const [timeRemaining, setTimeRemaining] = useState(12);

  const providerName = booking.provider_name || 'Rajesh Shrestha (Demo)';
  const serviceCat = booking.service_category || 'Expert Service';

  const statuses = [
    { label: 'Booking Confirmed', time: '10:32 AM', desc: 'System received and validated request.' },
    { label: 'Provider Assigned', time: '10:35 AM', desc: `${providerName} accepted the job.` },
    { label: 'Provider En Route', time: 'Pending', desc: 'Provider is traveling to your location.' },
    { label: 'Work In Progress', time: 'Pending', desc: 'Repair work is currently underway.' },
    { label: 'Job Completed', time: 'Pending', desc: 'Job finished. Invoice generated.' }
  ];

  useEffect(() => {
    // Listen to real-time socket updates for location
    const socket = getSocket();
    if (socket) {
      socket.on('location_update', (data) => {
        if (data.lat && data.lng) {
          setProviderPos([data.lat, data.lng]);
        }
        if (data.distance) setDistance(data.distance);
        if (data.timeRemaining) setTimeRemaining(data.timeRemaining);
      });
    }

    return () => {
      if (socket) {
        socket.off('location_update');
      }
    };
  }, []);

  // Animate provider icon when status changes manually via button
  useEffect(() => {
    if (currentStatus === 2) { // En route
      setProviderPos([28.2150, 83.9800]); // Moving closer
      setDistance(1.2);
      setTimeRemaining(6);
    } else if (currentStatus >= 3) { // In Progress or Completed
      setProviderPos(userLocation); // At user location
      setDistance(0.0);
      setTimeRemaining(0);
    } else {
      setProviderPos(initialProviderLocation);
      setDistance(2.4);
      setTimeRemaining(12);
    }
  }, [currentStatus]);

  const simulateProgress = () => {
    if (currentStatus < 4) {
      setCurrentStatus(currentStatus + 1);
    } else {
      setCurrentStatus(0); // Reset
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Live Job Tracking</h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">Booking #{booking.id ? `GS-2024-${booking.id}` : 'GS-2024-DEMO'}</p>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 bg-[#d1fae5] text-[#065f46] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              Active Job
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column: Provider Info & Status Timeline */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Provider Card */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150"
                    alt={providerName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h2 className="font-bold text-gray-800 text-base">{providerName}</h2>
                    <p className="text-xs text-gray-400 font-medium">{serviceCat}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <span className="text-yellow-500 font-extrabold">★ 4.9</span>
                      <span className="text-gray-400">(142 jobs)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href="tel:9841123456" className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-sm">
                    <Phone className="w-4 h-4" />
                  </a>
                  <button className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-center">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Arrival Time</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">11:00 AM</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Distance</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">~{distance.toFixed(1)} km away</p>
                </div>
              </div>
            </div>

            {/* Job Status Timeline */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-6">Job Status</h3>
              <div className="relative pl-8 space-y-6">
                
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {statuses.map((status, index) => {
                  const isDone = index < currentStatus;
                  const isActive = index === currentStatus;
                  
                  let icon = <Compass className="w-3.5 h-3.5" />;
                  if (index === 0) icon = <CheckCircle2 className="w-3.5 h-3.5" />;
                  if (index === 1) icon = <Navigation className="w-3.5 h-3.5" />;
                  if (index === 2) icon = <Compass className="w-3.5 h-3.5" />;
                  if (index === 3) icon = <Wrench className="w-3.5 h-3.5" />;
                  if (index === 4) icon = <Check className="w-3.5 h-3.5" />;

                  let itemTime = status.time;
                  if (index === 2 && currentStatus >= 2) itemTime = '10:48 AM';
                  if (index === 3 && currentStatus >= 3) itemTime = '11:02 AM';
                  if (index === 4 && currentStatus >= 4) itemTime = '11:20 AM';

                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all z-10 ${
                        isDone
                          ? 'bg-[#10b981] border-[#10b981] text-white shadow-sm'
                          : isActive
                            ? 'bg-[#07535f] border-[#07535f] text-white shadow-md ring-4 ring-[#07535f]/15'
                            : 'bg-white border-gray-200 text-gray-400'
                      }`}>
                        {icon}
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className={`text-xs font-bold transition-colors ${
                            isActive ? 'text-gray-800' : isDone ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {status.label}
                            {isActive && <span className="ml-1.5 text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">Live</span>}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {itemTime}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
                          {status.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Leaflet Map & Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Real Interactive Map */}
            <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col h-[350px]">
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-50 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#07535f]" />
                <span className="text-xs font-bold text-gray-700">Live Location Map (Pokhara, Nepal)</span>
              </div>

              <div className="relative flex-grow bg-gray-100 overflow-hidden z-0">
                <MapContainer center={userLocation} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  {/* User Location */}
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold text-gray-800 text-xs">Your Location</p>
                        <p className="text-gray-500 text-[10px]">Lakeside, Pokhara</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Provider Live Location Pin */}
                  {currentStatus < 4 && (
                    <Marker position={providerPos} icon={providerIcon}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold text-[#07535f] text-xs">{providerName}</p>
                          <p className="text-gray-500 text-[10px]">
                            {timeRemaining > 0 ? `~${timeRemaining} mins away` : 'Arrived'}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  <ChangeView center={providerPos} />
                </MapContainer>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Booking Summary</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                
                <div className="bg-gray-50/50 p-4 rounded-xl flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Service</span>
                    <span className="text-sm font-bold text-gray-800 block mt-0.5">Pipe Leak Repair</span>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl flex items-start gap-3">
                  <Compass className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Scheduled</span>
                    <span className="text-sm font-bold text-gray-800 block mt-0.5">Today, 11:00 AM</span>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Address</span>
                    <span className="text-sm font-bold text-gray-800 block mt-0.5">Lakeside, Pokhara</span>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Est. Cost</span>
                    <span className="text-sm font-extrabold text-[#07535f] block mt-0.5">Rs. 500 - 800</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-150 pt-6">
          <button
            onClick={simulateProgress}
            className="w-full sm:w-auto bg-[#10b981] hover:bg-[#0ea572] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-1.5"
          >
            <span>Simulate Progress</span>
            <Compass className="w-4 h-4" />
          </button>
          
          <div className="flex w-full sm:w-auto gap-4">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  navigate('/');
                }
              }}
              className="flex-1 sm:flex-none border border-red-200 hover:bg-red-50 text-red-600 px-6 py-3 rounded-full text-xs font-bold transition-all text-center"
            >
              Cancel Booking
            </button>
            <button
              onClick={() => alert('Chat interface opened.')}
              className="flex-1 sm:flex-none border border-[#07535f] hover:bg-[#07535f]/5 text-[#07535f] px-6 py-3 rounded-full text-xs font-bold transition-all text-center"
            >
              Chat with Provider
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
