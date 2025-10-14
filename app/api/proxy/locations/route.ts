import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://ocm.alo123.net/api';
const ORIGIN_HEADER = 'https://cua-hang-gia-dung-minh-ngoc.localhost';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = `${API_BASE_URL}/admin/locations`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Origin': ORIGIN_HEADER,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

