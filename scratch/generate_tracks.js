const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tracks = [
    {
        name: 'Arpeggio Run',
        notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00],
        tempo: 150
    },
    {
        name: 'Bass Line',
        notes: [65.41, 82.41, 98.00, 65.41, 73.42, 87.31, 65.41, 73.42],
        tempo: 120
    },
    {
        name: 'Melody',
        notes: [440, 392, 349.23, 392, 440, 493.88, 523.25, 493.88, 440, 392, 349.23, 329.63],
        tempo: 180
    }
];

function generateTrackWav(track, numLoops, volume, filePath) {
    const sampleRate = 44100;
    const noteDuration = 60 / track.tempo; // seconds per note
    const totalNotes = track.notes.length * numLoops;
    const numSamples = Math.floor(sampleRate * noteDuration * totalNotes);
    const bufferLength = 44 + numSamples * 2;
    const buffer = Buffer.alloc(bufferLength);

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    const samplesPerNote = Math.floor(sampleRate * noteDuration);

    for (let loop = 0; loop < numLoops; loop++) {
        for (let n = 0; n < track.notes.length; n++) {
            const freq = track.notes[n];
            const offset = (loop * track.notes.length + n) * samplesPerNote;
            
            for (let i = 0; i < samplesPerNote; i++) {
                // Square wave
                const val = (Math.sin(2 * Math.PI * freq * (i / sampleRate)) >= 0) ? 1 : -1;
                // Decay envelope per note
                const t = i / sampleRate;
                const decay = Math.exp(-t * 6.0); // crisp pluck
                const sample = Math.floor(val * 32767 * volume * decay);
                
                // Write sample, avoiding writing past buffer length due to rounding
                if (44 + (offset + i) * 2 < bufferLength) {
                    buffer.writeInt16LE(sample, 44 + (offset + i) * 2);
                }
            }
        }
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);

    // Convert to MP3
    const mp3Path = filePath.replace('.wav', '.mp3');
    try {
        execSync(`ffmpeg -y -i "${filePath}" -codec:a libmp3lame -b:a 128k "${mp3Path}"`, { stdio: 'ignore' });
        console.log(`Generated: ${path.basename(mp3Path)}`);
    } catch (err) {
        console.log(`Failed to convert to MP3: ${path.basename(filePath)}`);
    }
}

const outputDir = path.join(__dirname, '..', 'examples', 'audio');
console.log('Generating full chiptune tracks...');

tracks.forEach((track, index) => {
    const filePath = path.join(outputDir, `track_${index}.wav`);
    // Generate 4 loops so it plays for a reasonable amount of time before standard looping kicks in
    generateTrackWav(track, 8, 0.5, filePath); 
});

console.log('Done!');
