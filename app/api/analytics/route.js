import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        const decoded = await verifyAuth();
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get total products
        const totalProducts = await Product.countDocuments({ createdBy: decoded.id });

        // Get total value of stock
        const products = await Product.find({ createdBy: decoded.id });
        const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
        const lowStock = products.filter(p => p.stock < 10).length;

        // Aggregate by category using JS (simpler and safer than MongoDB aggregate)
        const categoryMap = {};
        products.forEach(p => {
            if (!categoryMap[p.category]) {
                categoryMap[p.category] = { count: 0, value: 0 };
            }
            categoryMap[p.category].count += 1;
            categoryMap[p.category].value += (p.price * p.stock);
        });

        const categoryData = Object.keys(categoryMap).map(key => ({
            category: key,
            ...categoryMap[key]
        }));

        return NextResponse.json({
            success: true,
            data: {
                totalProducts,
                totalValue,
                lowStock,
                categoryStats: categoryData
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
