'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Other'];

export default function ProductModal({ isOpen, onClose, product, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                stock: product.stock || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: ''
            });
        }
    }, [product, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSave({
                ...formData,
                _id: product?._id,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#131C2E] rounded-2xl w-full max-w-lg px-6 py-4 space-y-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold gradient-text">
                        {product ? 'Edit Product' : 'Create Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={loading}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            className="input-field resize-none"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={loading}
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input-field"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                disabled={loading}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                disabled={loading}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Custom Dropdown */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <button
                            type="button"
                            onClick={() => !loading && setDropdownOpen(!dropdownOpen)}
                            disabled={loading}
                            className="input-field text-left flex items-center justify-between"
                        >
                            <span className={formData.category ? 'text-white' : 'text-gray-400'}>
                                {formData.category || 'Select a category'}
                            </span>
                            <svg
                                className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>


                        {dropdownOpen && (
                            <div className="absolute z-10 w-full bottom-full mb-2 bg-[#131C2E] border border-white/10 rounded-xl overflow-hidden animate-slide-up shadow-2xl">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, category });
                                            setDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${formData.category === category ? 'bg-purple-500/20 text-purple-300' : 'text-white'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.category}
                            className="flex-1 btn-primary"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {product ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                product ? 'Update Product' : 'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
