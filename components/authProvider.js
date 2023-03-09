import { supabase } from "../lib/supabaseClient.js";
import { useContext, createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const auth = supabase.auth;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  //session処理の実行中は画面を表示しないようにする
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

  const login = async ({ email, password }) => {
    await auth.signInWithPassword({ email: email, password: password });
  };

  const signup = async ({ email, password }) => {
    await auth.signUp({ email: email, password: password });
  };

  const loginGoogle = async () => {
    await auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = () => {
    auth.signOut();
  };

  const exposed = {
    session,
    loading,
    setLoading,
    signup,
    login,
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
