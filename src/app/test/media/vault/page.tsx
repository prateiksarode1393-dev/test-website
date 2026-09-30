import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';

import { ArrowLeft, Download, FileText, Archive, FileVideo, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

const ASSETS = [
  { name: 'Documentation.pdf', ext: '.pdf', size: '1.2 MB', type: 'document', url: '/dummy/doc.pdf' },
  { name: 'Financials.xlsx', ext: '.xlsx', size: '450 KB', type: 'spreadsheet', url: '/dummy/sheet.xlsx' },
  { name: 'Project_Archive.zip', ext: '.zip', size: '12.8 MB', type: 'archive', url: '/dummy/archive.zip' },
  { name: 'Backup.tar.gz', ext: '.tar.gz', size: '85 MB', type: 'archive', url: '/dummy/backup.tar.gz' },
  { name: 'Data_Export.csv', ext: '.csv', size: '2.1 MB', type: 'document', url: '/dummy/data.csv' },
  { name: 'Promo_Video.mp4', ext: '.mp4', size: '45 MB', type: 'video', url: '/dummy/video.mp4' },
  { name: 'Whitepaper.docx', ext: '.docx', size: '800 KB', type: 'document', url: '/dummy/whitepaper.docx' },
];

export default function AssetVault() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Asset <span className="text-green-500">Vault</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Resource library with binary files. Every link is a direct asset outlink for crawler discovery.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSETS.map((asset) => (
          <div key={asset.name} className="p-6 rounded-2xl bg-[#0f0f12] border border-slate-800 hover:border-green-500/50 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                {asset.type === 'video' && <FileVideo className="w-6 h-6" />}
                {asset.type === 'archive' && <Archive className="w-6 h-6" />}
                {asset.type === 'spreadsheet' && <FileSpreadsheet className="w-6 h-6" />}
                {asset.type === 'document' && <FileText className="w-6 h-6" />}
              </div >
              <span className="text-[10px] font-mono text-slate-500 uppercase">{asset.ext}</span>
            </div >
            <div className="space-y-3">
              <h3 className="text-white font-bold truncate">{asset.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{asset.size}</span>
                <a href={asset.url} download className="flex items-center gap-1 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors">
                  <Download className="w-3 h-3" /> Download
                </a>
              </div >
            </div >
          </div >
        ))}
      </div >
    </div >
  );
}

