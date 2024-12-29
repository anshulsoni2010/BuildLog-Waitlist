import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
