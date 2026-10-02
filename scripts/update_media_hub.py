import re

with open('temp_page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_videos = """const WORKING_VIDEOS = [
  // Third-Party Embeds (Using the most compatible embed formats for crawlers)
  { name: 'YouTube', url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', color: 'text-red-500', type: 'third-party' },
  { name: 'Vimeo', url: 'https://player.vimeo.com/video/76979871', color: 'text-blue-400', type: 'third-party' },
  { name: 'DailyMotion', url: 'https://www.dailymotion.com/embed/x7l7z8u', color: 'text-blue-600', type: 'third-party' },
  { name: 'Cloudflare Stream', url: 'https://customer-7asv3m7n0v2777v.cloudflarestream.com/embed/f74a57663f8745f4b402c8860c078e0e', color: 'text-orange-400', type: 'third-party' },
  { name: 'TikTok', url: 'https://www.tiktok.com/embed/7123456789012345678', color: 'text-pink-500', type: 'third-party' },
  { name: 'Instagram', url: 'https://www.instagram.com/p/C_sample1/embed', color: 'text-purple-500', type: 'third-party' },
  { name: 'Twitch', url: 'https://player.twitch.tv/?channel=shroud&parent=localhost', color: 'text-purple-600', type: 'third-party' },
  { name: 'JW Player', url: 'https://content.jwplatform.com/videos/sample1.m3u8', color: 'text-blue-500', type: 'third-party' },
  
  // Native Localized-Style Streams (Require local files in /public/videos/)
  { name: 'Native MP4 (Basic)', url: '/videos/sample.mp4', color: 'text-green-400', type: 'native' },
  { name: 'Native MP4 (Alternative)', url: '/videos/alt_sample.mp4', color: 'text-green-600', type: 'native' },
  { name: 'Direct Stream (Sample)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', color: 'text-green-700', type: 'native' },
  { name: 'Native MP4 (Fast)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', color: 'text-green-500', type: 'native' },
];"""

# Regex to find the WORKING_VIDEOS array
pattern = r"const WORKING_VIDEOS = \[.*?\];"
# Use flags=re.DOTALL to match across multiple lines
updated_content = re.sub(pattern, new_videos, content, flags=re.DOTALL)

with open('src/app/test/media/page.tsx', 'w', encoding='utf-8') as f:
    f.write(updated_content)
