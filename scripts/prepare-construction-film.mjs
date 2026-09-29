import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';

const input = process.argv[2];
const prefix = process.argv[3] || 'construction';
if (!input) throw new Error('Supply the approved source video path.');
mkdirSync('public/media', { recursive: true });

function encode(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg failed: ${result.status}`);
}

// Short keyframe intervals and no B-frames make random scroll seeks inexpensive.
for (const [file, width, crf] of [[`${prefix}.mp4`, 1600, 22], [`${prefix}-mobile.mp4`, 960, 24]]) {
  encode(['-i', input, '-an', '-vf', `scale=${width}:-2`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-g', '6', '-keyint_min', '6', '-sc_threshold', '0', '-bf', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `public/media/${file}`]);
}
encode(['-i', input, '-frames:v', '1', '-vf', 'scale=1600:-2', '-quality', '84', `public/media/${prefix}-beginning.webp`]);
encode(['-sseof', '-0.1', '-i', input, '-frames:v', '1', '-vf', 'scale=1600:-2', '-quality', '84', `public/media/${prefix}-completed.webp`]);
console.log('Prepared desktop/mobile scroll films and matching posters.');
