'use client';

import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded?: (customer: any) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onCustomerAdded }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'billing'>('basic');
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    countryCode: '+84',
    birthDate: '',
    gender: '',
    marketingOptIn: false,
    country: 'Vietnam',
    city: '',
    district: '',
    ward: '',
    address: '',
    taxCode: '',
    companyName: '',
    billingAddress: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.phone) {
      alert('Vui lòng nhập đầy đủ tên và số điện thoại');
      return;
    }

    // Create customer object
    const newCustomer = {
      id: `CUS-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email,
      totalPurchases: 0,
      points: 0,
      createdAt: new Date(),
      // Additional fields
      birthDate: formData.birthDate,
      gender: formData.gender,
      marketingOptIn: formData.marketingOptIn,
      country: formData.country,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      address: formData.address,
      taxCode: formData.taxCode,
      companyName: formData.companyName,
      billingAddress: formData.billingAddress
    };

    // Call callback if provided
    if (onCustomerAdded) {
      onCustomerAdded(newCustomer);
    }

    // Reset form
    setFormData({
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      countryCode: '+84',
      birthDate: '',
      gender: '',
      marketingOptIn: false,
      country: 'Vietnam',
      city: '',
      district: '',
      ward: '',
      address: '',
      taxCode: '',
      companyName: '',
      billingAddress: ''
    });
    
    setActiveTab('basic');
    onClose();
  };

  const navItems = [
    { id: 'basic' as const, label: 'Thông tin cơ bản', icon: User },
    { id: 'address' as const, label: 'Địa chỉ', icon: MapPin },
    { id: 'billing' as const, label: 'Thông tin xuất hoá đơn', icon: FileText }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm mới khách hàng" size="md">
      <div className="flex h-[500px]">
        {/* Left Navigation */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-3">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Nhập họ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Nhập tên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Nhập email khách hàng"
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <div className="flex">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 text-sm"
                  >
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+86">🇨🇳 +86</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    placeholder="Chọn ngày sinh"
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                <div className="flex space-x-6">
                  {[
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Marketing Opt-in */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={formData.marketingOptIn}
                  onChange={(e) => handleInputChange('marketingOptIn', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor="marketing" className="ml-2 text-gray-700">
                  Khách hàng muốn nhận tiếp thị
                </label>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Địa chỉ</h3>
              
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quốc gia</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="Vietnam">Vietnam</option>
                  <option value="USA">United States</option>
                  <option value="China">China</option>
                </select>
              </div>

              {/* City and District */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Nhập tỉnh/thành phố"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="Nhập quận/huyện"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Ward and Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã</label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => handleInputChange('ward', e.target.value)}
                    placeholder="Nhập phường/xã"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Thông tin xuất hoá đơn</h3>
              
              {/* Tax Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={(e) => handleInputChange('taxCode', e.target.value)}
                  placeholder="Nhập mã số thuế"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Nhập tên công ty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ xuất hoá đơn</label>
                <textarea
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="Nhập địa chỉ xuất hoá đơn"
                  rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-4 py-2 text-sm"
        >
          Hủy (ESC)
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          Thêm (F8)
        </Button>
      </div>
    </Modal>
  );
};
