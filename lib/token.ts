import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-key';

export function generateVerificationToken(email: string): string {
  // Create a JWT token that expires in 24 hours
  return jwt.sign(
    { 
      email,
      type: 'email-verification',
      timestamp: Date.now() // Add timestamp to make each token unique
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      email: string; 
      type: string;
      timestamp: number;
    };
    
    if (decoded.type !== 'email-verification') {
      return null;
    }
    
    return { email: decoded.email };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
