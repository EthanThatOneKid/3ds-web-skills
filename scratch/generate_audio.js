const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function saveWavFile(frequency, duration, volume, filePath) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const bufferLength = 44 + numSamples * 2;
  const buffer = Buffer.alloc(bufferLength);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (1 for PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count (1 for mono)
  buffer.writeUInt16LE(1, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate (sample rate * block align)
  buffer.writeUInt32LE(sampleRate * 2, 28);
  // block align (channel count * bytes per sample)
  buffer.writeUInt16LE(2, 32);
  // bits per sample
  buffer.writeUInt16LE(16, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // chunk length
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Generate square wave samples with elegant exponential decay (synth pluck)
  for (let i = 0; i < numSamples; i++) {
    const val = (Math.sin(2 * Math.PI * frequency * (i / sampleRate)) >= 0) ? 1 : -1;
    const t = i / sampleRate;
    const decay = Math.exp(-t * 3.5); // Smooth fade-out
    const sample = Math.floor(val * 32767 * volume * decay);
    buffer.writeInt16LE(sample, 44 + i * 2);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  
  // Convert to MP3 using ffmpeg
  const mp3Path = filePath.replace('.wav', '.mp3');
  try {
    execSync(`ffmpeg -y -i "${filePath}" -codec:a libmp3lame -q:a 2 "${mp3Path}"`, { stdio: 'ignore' });
    console.log(`Generated: ${path.basename(mp3Path)}`);
  } catch (err) {
    console.log(`Failed to convert to MP3, using WAV fallback only for: ${path.basename(filePath)}`);
  }
}

const frequencies = [
  65.41, 73.42, 82.41, 87.31, 98.00, 
  196.00, 261.63, 329.63, 349.23, 392.00, 
  440.00, 493.88, 523.25
];

const outputDir = path.join(__dirname, '..', 'examples', 'audio');

console.log('Generating chiptune MP3 note files (1.5s plucks)...');
frequencies.forEach(freq => {
  const fileName = `note_${freq.toFixed(2)}.wav`;
  const filePath = path.join(outputDir, fileName);
  saveWavFile(freq, 1.5, 0.5, filePath); // 1.5s duration, 50% volume with exponential decay
});
console.log('All audio note files generated successfully!');
