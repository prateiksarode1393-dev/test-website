import { redirect } from 'next/navigation';

export const dynamic = 'force-static';
export default function RedirectStep2() {
  redirect('/test/http/redirect/step-3');
  return null;
}

