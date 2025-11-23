import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

interface UsernameInputProps {
  onSubmit: (username: string) => void;
}

export function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick ping function to test backend connectivity
const pingServer = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/ping`, { timeout: 2000 });
    return res.status === 200;
  } catch {
    return false;
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (username.trim().length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    setLoading(true);

    const serverAlive = await pingServer();
    if (!serverAlive) {
      setError('Cannot reach server. Please check your connection.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/register`,
        { username: username.trim() },
        { timeout: 5000, withCredentials: true }
      );

      console.log('Server response:', res.data);
      onSubmit(username.trim());
    } catch (err: any) {
      if (err.response) {
        console.error('Server Error:', err.response.status, err.response.data);
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        console.error('Network Error / No Response:', err.request);
        setError('Network Error: Could not reach server.');
      } else {
        console.error('Axios Error:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-center mb-8 relative"
        >
          <Gift className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -mt-16 ml-20 animate-pulse" />
        </motion.div>

        <div className="text-center mb-8">
          <h1 className="text-4xl mb-3 text-white">Mystery Box Challenge</h1>
          <p className="text-gray-400">Enter your username to begin your adventure</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-gray-700"
        >
          <div className="mb-6">
            <label htmlFor="username" className="block text-white mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-yellow-400" />
              <span>Your Username</span>
            </label>

            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your username..."
              className="w-full bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
              maxLength={20}
              autoFocus
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-6 text-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Start Playing'}
          </Button>

          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 text-center">🎯 50 mystery boxes waiting for you</p>
            <p className="text-sm text-gray-400 text-center mt-1">💎 Only 5 winners out of 200 players</p>
          </div>
        </form>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 20 }}
              animate={{ y: -20, opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
}
