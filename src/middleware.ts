import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // If the token is missing or invalid, redirect to the login page
    if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Continue with the request if the token is present
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!billing/plans|_next|signin).*)",  // Match all routes except /billing/plans and /signin
    ],
}
