import { AuthProvider } from "../components/authProvider.js"
import { useRouter } from "next/router"
import ProtectedRoute from "../components/protectedRoute.js"

const noAuthRequired = ["/login","/signup","/chart"]

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <AuthProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  )
}

