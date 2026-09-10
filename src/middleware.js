import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isStudioPath = req.nextUrl.pathname.startsWith('/studio');
  const isAuthPage = req.nextUrl.pathname === '/studio/login' || req.nextUrl.pathname === '/studio/unauthorized';

  // Protect all /studio paths except login/unauthorized
  if (isStudioPath && !isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/studio/login', req.nextUrl));
  }

  // Redirect logged in users away from the login page
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/studio', req.nextUrl));
  }

  return NextResponse.next();
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
