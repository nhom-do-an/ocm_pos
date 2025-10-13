# OMNI POS System

Hệ thống quản lý bán hàng (Point of Sale) được xây dựng bằng Next.js 15 và TypeScript.

## Tính năng

### 1. Bán hàng (POS)
- **Multi-tab orders**: Tạo và quản lý nhiều đơn hàng cùng lúc
- Giao diện bán hàng trực quan
- Tìm kiếm sản phẩm nhanh chóng theo tên, SKU, mã vạch
- Lọc theo danh mục
- Giỏ hàng với quản lý số lượng
- Ghi chú cho từng sản phẩm và đơn hàng
- Tính toán tự động thuế và giảm giá
- Hỗ trợ nhiều phương thức thanh toán:
  - Tiền mặt
  - Thẻ
  - Chuyển khoản

### 2. Quản lý Chi nhánh & Nhân viên
- Chọn chi nhánh bán hàng
- Chọn nhân viên thực hiện giao dịch
- Lọc sản phẩm theo tồn kho chi nhánh
- Theo dõi doanh số theo chi nhánh

### 3. Quản lý Khách hàng
- Tìm kiếm khách hàng nhanh
- Lưu trữ thông tin chi tiết
- Điểm tích lũy
- Thêm khách hàng mới nhanh chóng

### 4. Tra cứu Tồn kho
- Hiển thị tồn kho theo bảng chi tiết
- Tìm kiếm theo tên, SKU, mã vạch
- Lọc theo danh mục và chi nhánh
- Hiển thị tồn kho từng chi nhánh
- Tính giá trị tồn kho
- Cảnh báo tồn kho thấp

### 5. Quản lý Đơn hàng
- Lịch sử đơn hàng đầy đủ
- Chi tiết khách hàng, chi nhánh, nhân viên
- Trạng thái đơn hàng
- Phương thức thanh toán
- Filter và search mạnh mẽ
- Xem chi tiết từng đơn hàng

## Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Cấu trúc thư mục

```
omni-pos/
├── app/                    # Next.js App Router
│   ├── pos/               # Trang bán hàng
│   ├── orders/            # Quản lý đơn hàng
│   ├── inventory/         # Tra cứu tồn kho
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (Button, Card, Input, Modal)
│   ├── pos/              # POS-specific components
│   └── layout/           # Layout components (Sidebar)
├── store/                # Zustand stores
│   └── pos-store.ts      # POS state management
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
└── lib/                  # Utility functions
    ├── utils.ts          # Helper functions
    └── mock-data.ts      # Mock data
```

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production
npm start
```

## Sử dụng

1. Truy cập http://localhost:3000
2. Hệ thống sẽ tự động chuyển đến trang bán hàng `/pos`
3. Chọn chi nhánh và nhân viên bán hàng
4. (Tùy chọn) Chọn khách hàng
5. Nhấp vào sản phẩm để thêm vào giỏ hàng
6. Điều chỉnh số lượng bằng nút +/-
7. Thêm ghi chú nếu cần
8. Nhấn "Thanh toán" để hoàn tất đơn hàng
9. Chọn phương thức thanh toán và xác nhận

## Tính năng nổi bật

- ✅ Multi-tab orders (nhiều đơn hàng cùng lúc)
- ✅ Quản lý chi nhánh và nhân viên
- ✅ Tìm kiếm khách hàng nhanh
- ✅ Ghi chú linh hoạt
- ✅ Responsive design
- ✅ Real-time cart updates
- ✅ Category filtering
- ✅ Product search
- ✅ Automatic tax calculation
- ✅ Discount support
- ✅ Order history
- ✅ Customer information tracking
- ✅ Inventory management

## Phát triển

Dự án này sử dụng:
- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for styling

## License

MIT

---

**Version**: 2.0.0  
**© 2025 OMNI POS System**
