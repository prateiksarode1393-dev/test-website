import React from 'react';
import { motion } from 'framer-motion';

export const runtime = 'edge';
import { Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HttpStatusPage({ params }: { params: { status: string } }) {
  const status = params.status;
  const isError = parseInt(status) >= 400;
  const isServerError = parseInt(status) >= 500;

  const statusConfig: Record<string, { title: string; desc: string; color: string }> = {
    '400': { title: 'Bad Request', desc: 'The server cannot process the request due to a client error.', color: 'text-yellow-500' },
    '401': { title: 'Unauthorized', desc: 'Authentication is required and has failed or has not yet been provided.', color: 'text-orange-500' },
    '403': { title: 'Forbidden', desc: 'The server understood the request but refuses to authorize it.', color: 'text-red-500' },
    '404': { title: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.', color: 'text-blue-500' },
    '405': { title: 'Method Not Allowed', desc: 'The request method is known by the server but is not supported by the target resource.', color: 'text-yellow-500' },
    '406': { title: 'Not Acceptable', desc: 'The server cannot produce a response matching the list of acceptable values.', color: 'text-yellow-500' },
    '408': { title: 'Request Timeout', desc: 'The server timed out waiting for the request.', color: 'text-yellow-500' },
    '409': { title: 'Conflict', desc: 'The request could not be completed due to a conflict with the current state of the target resource.', color: 'text-yellow-500' },
    '410': { title: 'Gone', desc: 'The requested resource is no longer available and no forwarding address is known.', color: 'text-yellow-500' },
    '413': { title: 'Payload Too Large', desc: 'The request entity is larger than limits defined by server.', color: 'text-yellow-500' },
    '415': { title: 'Unsupported Media Type', desc: 'The media type of the request entity is not supported by the server.', color: 'text-yellow-500' },
    '422': { title: 'Unprocessable Entity', desc: 'The server understands the content type but was unable to process the contained instructions.', color: 'text-yellow-500' },
    '429': { title: 'Too Many Requests', desc: 'The user has sent too many requests in the given amount of time.', color: 'text-orange-500' },
    '500': { title: 'Internal Server Error', desc: 'The server encountered an unexpected condition that prevented it from fulfilling the request.', color: 'text-red-600' },
    '501': { title: 'Not Implemented', desc: 'The server does not support the functionality required to complete the request.', color: 'text-red-500' },
    '502': { title: 'Bad Gateway', desc: 'The server, while acting as a gateway, received an invalid response.', color: 'text-red-500' },
    '503': { title: 'Service Unavailable', desc: 'The server is currently unable to handle the request due to temporary overloading.', color: 'text-orange-600' },
    '504': { title: 'Gateway Timeout', desc: 'The server, while acting as a gateway, did not receive a timely response.', color: 'text-red-500' },
    '505': { title: 'HTTP Version Not Supported', desc: 'The server does not support the HTTP protocol version used in the request.', color: 'text-red-500' },
    '511': { title: 'Network Authentication Required', desc: 'The client needs to authenticate to gain network access.', color: 'text-red-500' },
  };

  const config = statusConfig[status] || {
    title: `HTTP ${status}`,
    desc: 'A custom HTTP status response for crawler testing.',
    color: 'text-slate-400'
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 text-center space-y-8 shadow-2xl relative overflow-hidden"
      >
        <div className={cn(
          "absolute top-0 left-0 w-full h-2",
          isServerError ? "bg-red-600" : "bg-yellow-500"
        )} />

        <div className="flex justify-center">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center bg-slate-900 border-4",
            isServerError ? "border-red-600" : "border-yellow-500"
          )}>
            <span className={cn("text-4xl font-black", config.color)}>{status}</span>
          </div>
        </div >

        <div className="space-y-4">
          <h1 className={cn("text-5xl font-bold tracking-tight", config.color)}>{config.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">{config.desc}</p>
        </div >

        <div className="pt-8 flex justify-center gap-4">
          <Link
            href="/test/http"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Matrix
          </Link>
        </div >
      </motion.div>
    </div >
  );
}
