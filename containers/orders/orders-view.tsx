'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, Search, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, Location, Employee } from '@/types';
import { mockEmployees } from '@/lib/mock-data';
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

  useEffect(() => {
    loadLocations(); // Load locations from API
    setEmployees(mockEmployees);
  }, [loadLocations, setEmployees]);

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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <div className="flex gap-6 mt-2">
            <p className="text-gray-600">
              Tổng: <span className="font-semibold">{filteredOrders.length}</span> đơn
            </p>
            <p className="text-gray-600">
              Doanh thu: <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả chi nhánh</option>
            {locations.map((location: Location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="flex gap-3 mb-6">
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="cash">Tiền mặt</option>
            <option value="card">Thẻ</option>
            <option value="transfer">Chuyển khoản</option>
          </select>

          <Button variant="primary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Chi nhánh</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nhân viên</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Khách hàng</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SL</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Tổng tiền</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Thanh toán</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: Order) => {
                  const location = locations.find((l: Location) => l.id === order.locationId);
                  const employee = employees.find((e: Employee) => e.id === order.employeeId);

                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {location?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {employee?.name || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{order.customerName || 'Khách lẻ'}</p>
                          {order.customerPhone && (
                            <p className="text-xs text-gray-500">{order.customerPhone}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-600">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chi nhánh</p>
                <p className="font-medium">
                  {locations.find((l: Location) => l.id === selectedOrder.locationId)?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhân viên</p>
                <p className="font-medium">
                  {employees.find((e: Employee) => e.id === selectedOrder.employeeId)?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Khách hàng</p>
                <p className="font-medium">{selectedOrder.customerName || 'Khách lẻ'}</p>
                {selectedOrder.customerPhone && (
                  <p className="text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Thanh toán</p>
                <p className="font-medium">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
              </div>
            </div>

            {selectedOrder.note && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Ghi chú đơn hàng:</p>
                <p className="text-sm">{selectedOrder.note}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Sản phẩm</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                      {item.note && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                          <FileText className="w-3 h-3" />
                          <span>{item.note}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thuế:</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
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
