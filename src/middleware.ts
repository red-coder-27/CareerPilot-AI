import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const protectedRoutes = ["/dashboard", "/analyze", "/history", "/interview", "/career"]
  const isProtectedRoute = protectedRoutes.some((route) => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  )

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyze/:path*",
    "/history/:path*",
    "/interview/:path*",
    "/career/:path*",
  ],
}
