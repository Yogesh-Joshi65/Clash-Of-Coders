import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Zap } from 'lucide-react';
import { socket } from '../utils/socket';

const Dashboard = () => {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState('');
  const [username, setUsername] = useState(''); // Start empty to avoid "Guest" flash if possible

  useEffect(() => {
    // Function to parse user data
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // Prioritize username -> name -> email -> Guest
          const name = user.username || user.name || (user.email ? user.email.split('@')[0] : 'Guest');
          setUsername(name);
        } else {
          setUsername('Guest');
        }
      } catch (error) {
        console.error("Dashboard: Error parsing user data", error);
        setUsername('Guest');
      }
    };

    loadUser();

    // Listen for storage events (in case login happens in another tab/window)
    window.addEventListener('storage', loadUser);
    
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (!socket.connected) socket.connect();
    navigate(`/arena/${roomId}?isHost=true`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId) return;
    const cleanId = joinRoomId.trim().toUpperCase();
    if (!socket.connected) socket.connect();
    navigate(`/arena/${cleanId}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, <span className="text-green-400">{username || 'User'}</span>
      </h1>
      <p className="text-slate-400 mb-8">Ready to compete?</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Room Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 transition-colors">
          <div className="bg-orange-600/20 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
             <Zap className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Create Battle Room</h2>
          <p className="text-slate-400 mb-6 text-sm">Start a new 1v1 match and invite a friend.</p>
          <button 
            onClick={handleCreateRoom}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold transition-colors"
          >
            Create New Room
          </button>
        </div>

        {/* Join Room Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
          <div className="bg-blue-600/20 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
             <Users className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Join Existing Room</h2>
          <p className="text-slate-400 mb-4 text-sm">Enter a Room ID to join a friend's game.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ROOM ID" 
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 outline-none focus:border-blue-500 uppercase text-white placeholder-slate-500"
            />
            <button 
              onClick={handleJoinRoom}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;