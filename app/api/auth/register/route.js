import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await dbConnect();

        const { name, email, password } = await req.json();

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
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
                { status: 201 }
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
                { message: 'Invalid user data' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
