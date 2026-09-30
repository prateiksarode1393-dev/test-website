import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function RedirectStep2() {
  redirect('/test/http/redirect/step-3');
  return null;
}
