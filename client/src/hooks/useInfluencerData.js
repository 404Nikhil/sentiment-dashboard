import { useState, useCallback } from 'react';

/**
 * Custom hook to fetch and manage influencer profile data.
 * @returns {object} The profile data, loading state, error state, and the fetch function.
 */
export const useInfluencerData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (user, force = false) => {
    if (!user) {
      setError("Please enter a username.");
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      let apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/influencer/${user}`;
      if (force) {
        apiUrl += '?force=true';
      }
      
      console.log(`Fetching data from: ${apiUrl}`); 

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ msg: `API request failed with status: ${response.status}` }));
        throw new Error(errData.msg || `API request failed with status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);

    } catch (err) {
      console.error("API fetch error:", err);
      setError(err.message || "Failed to fetch profile data. The account may not exist or the scraper might be blocked.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile };
};
