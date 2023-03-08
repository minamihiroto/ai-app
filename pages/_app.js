import { AuthProvider } from "../components/AuthProvider.js"
import { useRouter } from "next/router"
import ProtectedRoute from "../components/ProtectedRoute.js"

const noAuthRequired = ["/login","/signup"]

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

