import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "./authProvider.js";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const router = useRouter();
  
  //ログインしていないときに認証必要なページにアクセスしたときにログインページに飛ばす処理
  useEffect(() => {
    (async () => {
      if (!session && !loading) {
        router.push("/login");
        return;
      }
    })();
  });
  return <>{session && children}</>;
};

export default ProtectedRoute;
