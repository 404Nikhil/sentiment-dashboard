import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useInfluencerData } from './hooks/useInfluencerData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App = () => {
  const [username, setUsername] = useState('jiohotstarreality'); // default username
  const [inputValue, setInputValue] = useState('jiohotstarreality');
  const { profile, loading, error, fetchProfile } = useInfluencerData();

  useEffect(() => {
    fetchProfile(username, false);
  }, [username, fetchProfile]);

  const handleSubmit = (e, force = false) => {
    e.preventDefault();
    if (force) {
      fetchProfile(inputValue, true);
    } else {
      setUsername(inputValue);
    }
  };

  return (
    <div className="bg-background text-text-primary min-h-screen font-sans p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto mb-6">
        <form onSubmit={(e) => handleSubmit(e, false)} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Instagram Username"
            className="bg-card text-text-primary px-4 py-2 rounded-lg w-full md:w-1/3 border border-border focus:ring-2 focus:ring-primary outline-none transition"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading && username === inputValue ? 'Fetching...' : 'Fetch Profile'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
            title="Force Refresh (bypasses 24-hour cache)"
            disabled={loading}
          >
             <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
             <span>Force Refresh</span>
          </button>
        </form>
      </div>
      
      {error && !loading && <div className="max-w-[1400px] mx-auto mb-4 text-center bg-red-100 text-red-700 text-sm py-2 px-4 rounded-lg">{error}</div>}
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        {/* <Sidebar /> */}
        <main className="col-span-12 lg:col-span-11">
          <Dashboard profile={profile} loading={loading} error={null} />
        </main>
      </div>
    </div>
  );
};

export default App;
