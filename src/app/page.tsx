// This page now acts as a redirect to the main dashboard.
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './loading';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <Loading />;
}
