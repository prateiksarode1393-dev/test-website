import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function RedirectPage() {
  // We can use a query param to decide which redirect chain to use
  // Example: /test/http/redirect?type=external
  // Since this is a server component, we can access searchParams
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f12] text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold">Redirect Laboratory</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <a href="/test/http/redirect/external" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-center">External Redirect</a>
        <a href="/test/http/redirect/step-2" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-center">Chain Redirect (3 steps)</a>
        <a href="/test/http/404" className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl hover:bg-red-900/50 transition-all text-center text-red-400">Redirect to Error Page (404)</a>
      </div>
    </div>
  );
}
