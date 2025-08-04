import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!(?:_next|.*\\.(?:.*)|favicon.ico)).*)',
    '/store/orders/:path*',
    '/api/:path*',
  ],
 
};

