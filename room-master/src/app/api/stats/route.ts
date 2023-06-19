import { prisma } from '@/prismaClient';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json({ error: 'Invalid search parameters'}, { status: 404 });
  }
  if (search === 'reservations') {
    const num = await prisma.reservation.count();
    return NextResponse.json({ count: num }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid search parameters'}, { status: 404 });
};
