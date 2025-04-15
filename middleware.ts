import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from './types/auth'

// Define public paths that don't require authentication
const publicPaths = ['/login', '/signup', '/api/v1/auth/login', '/api/v1/auth/register']

// Define role-based access control
const roleAccessMap = {
  [Role.ADMINISTRATOR]: ['/admin', '/fleet', '/routes', '/analytics', '/user', '/'],
  [Role.FLEET_MANAGER]: ['/fleet', '/user'],
  [Role.ROUTE_PLANNER]: ['/routes', '/user'],
  [Role.ANALYST]: ['/analytics', '/user'],
  [Role.USER]: ['/user']
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get the token from the cookie
  const token = request.cookies.get('auth-token')?.value

  // If no token is present, redirect to login
  if (!token) {
    const loginUrl = new URL('/signup', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify the token and get the user's role
    const response = await fetch(`http://localhost:8081/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Handle non-OK responses without attempting to parse JSON
    if (!response.ok) {
      throw new Error('Invalid token')
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format')
    }

    const user = await response.json()
    const userRole = user.role as Role

    // Check if the user has access to the requested path
    const allowedPaths = roleAccessMap[userRole] || []
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path))

    if (!hasAccess) {
      // Redirect to unauthorized page if user doesn't have access
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    // If token verification fails, redirect to login
    const loginUrl = new URL('/signup', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 