import React from 'react';
import { Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import HttpStatusContent from './HttpStatusContent';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    '400', '401', '403', '404', '405', '406', '408', '409', '410', '413', '415', '422', '429', '500', '501', '502', '503', '504', '505', '511'
  ].map(status => ({ status }));
}

export default function HttpStatusPage({ params }: { params: { status: string } }) {
  return <HttpStatusContent status={params.status} />;
}
