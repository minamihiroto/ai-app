import { supabase } from "../lib/supabaseClient.js";
import { useContext, createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const auth = supabase.auth;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const {
        data: { session },
      } = await auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
        setSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  });

  const loginGoogle = async () => {
    await auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = async () => {
    await auth.signOut();
  };

  const exposed = {
    session,
    loading,
    setLoading,
    logout,
    loginGoogle,
  };

  return (
    <AuthContext.Provider value={exposed}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
