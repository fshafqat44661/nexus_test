'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnalyticsChart from '@/components/AnalyticsChart';
import ProductTable from '@/components/ProductTable';
import ProductModal from '@/components/ProductModal';
import ConfirmModal from '@/components/ConfirmModal';
import { withAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/analytics');
            const data = await res.json();

            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setConfirmDelete({ isOpen: true, productId: id });
    };

    const confirmDeleteProduct = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${confirmDelete.productId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Product deleted successfully');
                setRefreshTrigger(prev => prev + 1);
                fetchAnalytics(); // Refresh analytics
                setConfirmDelete({ isOpen: false, productId: null });
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting product');
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async (data) => {
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${data._id}` : '/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setIsModalOpen(false);
                toast.success(editingProduct ? 'Product updated' : 'Product created');
                setRefreshTrigger(prev => prev + 1);
                fetchAnalytics(); // Refresh analytics
            } else {
                toast.error('Failed to save product');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Error saving product');
        }
    };

    if (loading && !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <svg className="animate-spin h-12 w-12 text-purple-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 space-y-2 animate-fade-in">
                            <div className="text-sm text-gray-400 font-medium">Total Products</div>
                            <div className="text-3xl font-bold gradient-text">{stats.totalProducts}</div>
                        </div>
                        <div className="glass-panel p-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="text-sm text-gray-400 font-medium">Total Inventory Value</div>
                            <div className="text-3xl font-bold gradient-text">${stats.totalValue.toLocaleString()}</div>
                        </div>
                        <div className="glass-panel p-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="text-sm text-gray-400 font-medium">Low Stock Items</div>
                            <div className={`text-3xl font-bold ${stats.lowStock > 0 ? 'text-red-400' : 'gradient-text'}`}>
                                {stats.lowStock}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold gradient-text">Analytics Overview</h2>
                    <AnalyticsChart data={stats} />
                </section>

                {/* Product Management */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold gradient-text">Product Management</h2>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            + Add Product
                        </button>
                    </div>
                    <ProductTable
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRefresh={refreshTrigger}
                    />
                </section>
            </main>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                onSave={handleSave}
            />

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, productId: null })}
                onConfirm={confirmDeleteProduct}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleting}
            />
        </div>
    );
}

export default withAuth(Dashboard);
