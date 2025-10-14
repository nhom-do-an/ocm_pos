# OMNI POS System

Hệ thống Point of Sale (POS) được xây dựng với Next.js 15, TypeScript và Tailwind CSS.

## 🚀 Bắt đầu

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Mở trình duyệt
http://localhost:3000
```

Hệ thống sẽ tự động redirect đến trang đăng nhập.

## ✨ Tính năng

- **Bán hàng tại quầy**: Tạo và quản lý đơn hàng
- **Multi-tab orders**: Xử lý nhiều đơn hàng cùng lúc
- **Tìm kiếm sản phẩm**: 304 sản phẩm từ API thật
- **Quản lý chi nhánh**: Chọn chi nhánh và nhân viên
- **Quản lý khách hàng**: Tìm kiếm và thêm khách hàng
- **Thanh toán**: Nhiều phương thức thanh toán
- **Phím tắt**: F3, F4, F6, F9, F10

## 🔌 API

Hệ thống kết nối với OCM API qua Next.js proxy để bypass CORS:
- **Products/Variants**: 304 sản phẩm
- **Locations**: Chi nhánh
- **Search**: Tìm kiếm real-time

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Icons**: Lucide React
- **API**: Axios + Next.js API Routes

## 🎯 Đăng nhập

### Trang đăng nhập
- Truy cập: `http://localhost:3000/login`
- Khi click nút đăng nhập/đăng xuất ở trang POS sẽ tự động chuyển đến trang này
- Sau khi đăng nhập thành công, hệ thống tự động chuyển đến trang POS

### Đăng nhập:
Sử dụng số điện thoại (10 chữ số) và mật khẩu từ hệ thống OCM.

**Validation:**
- Số điện thoại: 10 chữ số, bắt đầu bằng 0
- Mật khẩu: 8-20 ký tự, có ít nhất 1 chữ cái và 1 chữ số

## 📝 Cấu trúc thư mục

```
app/
├── api/proxy/          # API proxy routes
├── pos/                # POS page
├── orders/             # Orders page
└── inventory/          # Inventory page

components/
├── auth/               # Login & Account
├── layout/             # Sidebar
├── pos/                # POS components
└── ui/                 # UI components

store/
├── pos-store.ts        # POS state
└── auth-store.ts       # Auth state

lib/
├── api/                # API services
├── api-config.ts       # Axios config
└── mock-data.ts        # Mock data
```

## 🛠️ Scripts

```bash
npm run dev      # Development với Turbopack
npm run build    # Build production
npm run start    # Start production server
```

## 📄 License

MIT

---

**Version**: 2.0.0  
**© 2025 OMNI POS System**
