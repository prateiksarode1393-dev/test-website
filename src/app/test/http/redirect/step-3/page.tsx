import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function RedirectStep3() {
  redirect('/test/http/redirect/step-4');
  return null;
}
