import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function adminAuth(request: NextRequest) {
  const session = await getToken({ req: request });

  // Check if user is authenticated and is an admin
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
}

export function withAdminAuth(handler: Function) {
  return async function(request: NextRequest) {
    const authResult = await adminAuth(request);
    if (authResult) return authResult;
    return handler(request);
  }
}
