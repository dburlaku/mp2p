import { useState, useEffect } from 'react';
import { loadIdentity, saveIdentity, clearIdentity } from '../utils/store';

export function useIdentity() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadIdentity();
    if (stored) {
      setIdentity(stored);
    }
    setLoading(false);
  }, []);

  const register = (data) => {
    saveIdentity(data);
    setIdentity(data);
  };

  const logout = () => {
    clearIdentity();
    setIdentity(null);
  };

  return { identity, loading, register, logout };
}
