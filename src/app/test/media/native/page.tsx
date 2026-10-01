import React from 'react';
export const dynamic = 'force-static';
import { Video, Music, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const NATIVE_VIDEOS = [
  { name: 'MP4 Standard', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.mp4', type: 'video/mp4' },
  { name: 'WebM Standard', url: 'https://www.w3schools.com/html/movie.webm', ext: '.webm', type: 'video/webm' },
  { name: 'OGG Video', url: 'https://www.w3schools.com/html/movie.ogv', ext: '.ogv', type: 'video/ogg' },
  { name: 'MOV Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.mov', type: 'video/quicktime' },
  { name: 'AVI Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.avi', type: 'video/x-msvideo' },
  { name: 'WMV Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.wmv', type: 'video/x-ms-wmv' },
  { name: 'FLV Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.flv', type: 'video/x-flv' },
  { name: 'M4V Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.m4v', type: 'video/mp4' },
  { name: '3GP Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.3gp', type: 'video/3gpp' },
  { name: 'MKV Format', url: 'https://www.w3schools.com/html/mov_bbb.mp4', ext: '.mkv', type: 'video/x-matroska' },
];

const NATIVE_AUDIO = [
  { name: 'MP3 Standard', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.mp3', type: 'audio/mpeg' },
  { name: 'WAV Lossless', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.wav', type: 'audio/wav' },
  { name: 'OGG Vorbis', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.ogg', type: 'audio/ogg' },
  { name: 'AAC Format', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.aac', type: 'audio/aac' },
  { name: 'M4A Format', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.m4a', type: 'audio/mp4' },
  { name: 'FLAC Lossless', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.flac', type: 'audio/flac' },
  { name: 'AIFF Format', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.aiff', type: 'audio/x-aiff' },
  { name: 'MID Sequence', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.mid', type: 'audio/midi' },
  { name: 'WMA Format', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.wma', type: 'audio/x-ms-wma' },
  { name: 'Opus Stream', url: 'https://www.w3schools.com/html/horse.mp3', ext: '.opus', type: 'audio/opus' },
];

export default function NativeMedia() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Native <span className="text-green-500">Media Extensions</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Testing the crawler's ability to recognize 20+ different media file extensions.
          <br /><br />
          <span className="text-sm bg-yellow-500/10 text-yellow-500 p-2 rounded border border-yellow-500/20 block">
            ⚠️ <strong>Note:</strong> Many of these formats (MKV, AVI, FLV) are not supported by modern browsers and will show a "Failed to load" error. This is intentional. The crawler must extract the source URL regardless of playback ability.
          </span>
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-white mb-6">
            <Video className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Video Extensions (10)</h2>
          </div >
          <div className="space-y-6">
            {NATIVE_VIDEOS.map((vid) => (
              <div key={vid.name} className="bg-[#0f0f12] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">{vid.name}</span>
                  <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">{vid.ext}</span>
                </div >
                <video controls className="w-full rounded-lg bg-black">
                  <source src={vid.url} type={vid.type} />
                  Your browser does not support the video tag.
                </video>
              </div >
            ))}
          </div >
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-white mb-6">
            <Music className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Audio Extensions (10)</h2>
          </div >
          <div className="space-y-6">
            {NATIVE_AUDIO.map((aud) => (
              <div key={aud.name} className="bg-[#0f0f12] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">{aud.name}</span>
                  <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">{aud.ext}</span>
                </div >
                <audio controls className="w-full">
                  <source src={aud.url} type={aud.type} />
                  Your browser does not support the audio tag.
                </audio>
              </div >
            ))}
          </div >
        </section>
      </div >
    </div >
  );
}

