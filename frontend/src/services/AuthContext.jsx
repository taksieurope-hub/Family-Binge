import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fb_token');
    const uid = localStorage.getItem('fb_uid');
    const email = localStorage.getItem('fb_email');
    const name = localStorage.getItem('fb_name');

    if (token && uid) {
      setUser({ uid, email, displayName: name });
      fetch(`https://family-binge-backend-2q4n.onrender.com/api/auth/me/${uid}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUserData(data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUserData = async () => {
    const uid = localStorage.getItem('fb_uid');
    if (uid) {
      const res = await fetch(`https://family-binge-backend-2q4n.onrender.com/api/auth/me/${uid}`);
      if (res.ok) setUserData(await res.json());
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
