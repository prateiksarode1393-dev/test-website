import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function ExternalRedirectPage() {
  // Redirect to an external site
  redirect('https://www.google.com');

  // This part is never reached
  return null;
}
