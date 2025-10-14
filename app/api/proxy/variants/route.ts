import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://ocm.alo123.net/api';
const ORIGIN_HEADER = 'https://cua-hang-gia-dung-minh-ngoc.localhost';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '100';

    const apiUrl = `${API_BASE_URL}/admin/variants?key=${encodeURIComponent(key)}&page=${page}&limit=${limit}`;
    
    // Debug log
    console.log('🔍 Proxy Request:', { key, page, limit });
    console.log('🌐 API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Origin': ORIGIN_HEADER,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Debug log response
    console.log('📦 API Response:', {
      count: data.data?.count,
      returned: data.data?.variants?.length,
    });
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

