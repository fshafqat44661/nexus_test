import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Find user by email
        // Need to explicitly select password since we excluded it in schema
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Create token
            const token = signToken(user);

            // Create response with cookie
            const response = NextResponse.json(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                { status: 200 }
            );

            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
