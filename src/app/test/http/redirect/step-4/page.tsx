import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function RedirectStep4() {
  // Final step redirects to success
  redirect('/test/http/redirect/success');
  return null;
}
