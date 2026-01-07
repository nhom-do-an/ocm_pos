'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { TabType } from '@/components/layout/main-tabs';
import { LocationSelector } from '@/components/layout/location-selector';
import { OrderTabs } from '@/components/pos/order-tabs';
import { ProductSearchDropdown } from '@/components/pos/product-search-dropdown';
import { Toaster } from '@/components/ui/toaster';
import POSView from '@/containers/pos/pos-view';
import OrdersView from '@/containers/orders/orders-view';

export default function POSDashboardLayout() {
    const { currentUser, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabType>('pos');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const getInitials = (firstName: string) => {
        return firstName?.charAt(0)?.toUpperCase() || 'U';
    };

    const getUserName = () => {
        return currentUser?.name || currentUser?.first_name || 'Người dùng';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Collapsible Sidebar */}
            {/* <CollapsibleSidebar activeTab={activeTab} onTabChange={setActiveTab} /> */}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-screen">
                {/* Header */}
                <header className="bg-blue-600 h-[60px] flex items-center justify-between px-6 gap-4 shadow-md w-full ">
                    {/* Left Section - Logo + Product Search */}
                    <div className="flex items-center justify-between gap-4 flex-1 w-[75%]">
                        <div className="flex gap-2 items-center">       {/* Logo */}
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-blue-600 font-bold text-xl">S</span>
                            </div>

                            {/* Product Search */}
                            {activeTab === 'pos' && (
                                <div className="flex-1 max-w-md">
                                    <ProductSearchDropdown />
                                </div>
                            )}</div>

                        {/* Center Section - Order Tabs */}
                        {activeTab === 'pos' && (
                            <div className=" flex-1 flex justify-end">
                                <OrderTabs />
                            </div>
                        )}
                    </div>



                    {/* Right Section */}
                    <div className="flex items-center justify-end gap-4 w-[25%]">
                        {/* Location Selector */}
                        <LocationSelector />


                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center p-1 cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-semibold text-blue-600">
                                    {getInitials(currentUser?.first_name || currentUser?.name || '')}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {getUserName()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {currentUser?.phone || currentUser?.email || ''}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            logout();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-hidden bg-gray-50">
                    {activeTab === 'pos' ? <POSView /> : <OrdersView />}
                </main>
            </div>

            {/* Close user menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
