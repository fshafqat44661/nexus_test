import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

export async function verifyAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export function signToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
}
