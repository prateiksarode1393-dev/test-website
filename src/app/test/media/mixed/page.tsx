import React from 'react';
export const dynamic = 'force-static';
import { PlayCircle, AlertTriangle } from 'lucide-react';

const PROVIDERS = [
  { name: 'YouTube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { name: 'Vimeo', url: 'https://player.vimeo.com/video/76979871' },
  { name: 'SoundCloud', url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/297630465' },
  { name: 'Wistia', url: 'https://fast.wistia.net/embed/iframe/26sk4lmiix' },
  { name: 'Brightcove', url: 'https://players.brightcove.net/1160438696001/RUsPQ8qzl_default/index.html?videoId=6327763506112' },
  { name: 'Kaltura', url: 'https://cdnapisec.kaltura.com/p/example/embedPlaykitJs/uiconf_id/example?iframeembed=true&entry_id=1_0idj0un000010p00z8784p4e0' },
  { name: 'DailyMotion', url: 'https://geo.dailymotion.com/player.html?video=x84sh87' },
  { name: 'Twitch', url: 'https://player.twitch.tv/?channel=shroud&parent=localhost' },
  { name: 'Facebook', url: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/10153231339946729/' },
  { name: 'Twitter', url: 'https://twitter.com/i embed/tweet/123456789' },
  { name: 'Native MP4', url: '/videos/sample.mp4' },
  { name: 'Native WebM', url: '/videos/alt_sample.webm' },
];

export default function MixedMediaHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-red-500">
          <AlertTriangle className="w-6 h-6" />
          <h1 className="text-4xl font-bold text-white tracking-tight">Mixed Media <span className="text-red-500">Stress Hub</span></h1>
        </div >
        <p className="text-slate-400 max-w-2xl">
          EXTREME DENSITY TEST: This page renders 10+ different video provider iframes and native tags simultaneously.
          Tests a crawler's ability to handle massive DOM bloat and concurrent cross-origin requests.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROVIDERS.map((p) => (
          <div key={p.name} className="bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">{p.name}</span>
              <PlayCircle className="w-3 h-3 text-slate-500" />
            </div >
            <div className="aspect-video bg-black">
              {p.name.startsWith('Native') ? (
                <video src={p.url} controls className="w-full h-full" />
              ) : (
                <iframe src={p.url} className="w-full h-full" allowFullScreen />
              )}
            </div >
          </div >
        ))}
      </div >
    </div >
  );
}
