import { redirect } from 'next/navigation';

export const dynamic = 'force-static';
export default function ExternalRedirectPage() {
  // Redirect to an external site
  redirect('https://www.google.com');

  // This part is never reached
  return null;
}

