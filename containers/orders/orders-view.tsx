'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, Search, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, Location, Employee } from '@/types';
import { toast } from 'sonner';

const OrdersView: React.FC = () => {
  const {
    orders,
    locations,
    employees,
    loadLocations,
    setEmployees
  } = usePOSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'card': return 'Thẻ';
      case 'transfer': return 'Chuyển khoản';
      default: return method;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Đang chờ';
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm));
    const matchesLocation = selectedLocation === 'all' || order.locationId === selectedLocation;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPayment = selectedPayment === 'all' || order.paymentMethod === selectedPayment;

    return matchesSearch && matchesLocation && matchesStatus && matchesPayment;
  });

  const totalRevenue = filteredOrders
    .filter((o: Order) => o.status === 'completed')
    .reduce((sum: number, order: Order) => sum + order.total, 0);

  const handleExport = () => {
    toast.info('Tính năng xuất Excel đang được phát triển!');
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <div className="flex flex-wrap gap-3 sm:gap-6 mt-2">
            <p className="text-sm sm:text-base text-gray-600">
              Tổng: <span className="font-semibold">{filteredOrders.length}</span> đơn
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              Doanh thu: <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả chi nhánh</option>
            {locations.map((location: Location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="cash">Tiền mặt</option>
            <option value="card">Thẻ</option>
            <option value="transfer">Chuyển khoản</option>
          </select>

          <Button variant="primary" onClick={handleExport} className="text-sm sm:text-base">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Xuất</span>
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Mã đơn</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">Thời gian</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Chi nhánh</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Nhân viên</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Khách hàng</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">SL</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Tổng tiền</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">Thanh toán</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Trạng thái</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: Order) => {
                  const location = locations.find((l: Location) => l.id === order.locationId);
                  const employee = employees.find((e: Employee) => e.id === order.employeeId);

                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-blue-600 text-xs sm:text-sm">{order.id}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {location?.name || '-'}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {employee?.name || '-'}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div>
                          <p className="font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{order.customerName || 'Khách lẻ'}</p>
                          {order.customerPhone && (
                            <p className="text-[10px] sm:text-xs text-gray-500">{order.customerPhone}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm hidden sm:table-cell">
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-blue-600 text-xs sm:text-sm">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center hidden md:table-cell">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-800 rounded-full text-[10px] sm:text-xs">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                Không tìm thấy đơn hàng nào
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Chi tiết đơn hàng ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Thời gian</p>
                <p className="font-medium text-sm sm:text-base">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Trạng thái</p>
                <span className={`inline-block px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Chi nhánh</p>
                <p className="font-medium text-sm sm:text-base">
                  {locations.find((l: Location) => l.id === selectedOrder.locationId)?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Nhân viên</p>
                <p className="font-medium text-sm sm:text-base">
                  {employees.find((e: Employee) => e.id === selectedOrder.employeeId)?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Khách hàng</p>
                <p className="font-medium text-sm sm:text-base">{selectedOrder.customerName || 'Khách lẻ'}</p>
                {selectedOrder.customerPhone && (
                  <p className="text-xs sm:text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Thanh toán</p>
                <p className="font-medium text-sm sm:text-base">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
              </div>
            </div>

            {selectedOrder.note && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Ghi chú đơn hàng:</p>
                <p className="text-xs sm:text-sm">{selectedOrder.note}</p>
              </div>
            )}

            <div className="border-t pt-3 sm:pt-4">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Sản phẩm</h3>
              <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-xs sm:text-sm truncate">{item.product.name}</p>
                      <p className="text-[10px] sm:text-sm text-gray-600">
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                      {item.note && (
                        <div className="mt-0.5 sm:mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-blue-600">
                          <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                          <span className="truncate">{item.note}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-xs sm:text-sm shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                <span>Tạm tính:</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                <span>Thuế:</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-red-600 text-xs sm:text-sm">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-xl font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersView;
