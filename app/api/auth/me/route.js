import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        const decoded = await verifyAuth();

        if (!decoded) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await User.findById(decoded.id);

        if (user) {
            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
