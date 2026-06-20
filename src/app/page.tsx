import React from 'react';
import { auth } from '@/auth';
import HomeClient from '@/components/home-client';

export default async function Page() {
  const session = await auth();

  return <HomeClient session={session} />;
}
