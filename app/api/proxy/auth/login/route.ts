import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://ocm.alo123.net/api';
const ORIGIN_HEADER = 'https://cua-hang-gia-dung-minh-ngoc.localhost';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxy Login Request:', { 
      name: body.name,
      phone: body.phone,
      store_name: body.store_name,
      province_code: body.province_code
    });

    const apiUrl = `${API_BASE_URL}/admin/auth/login`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN_HEADER,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('📦 API Response:', {
      success: data.success,
      message: data.message,
      status: response.status,
    });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
