const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateSFXWav(type, filePath) {
    var sampleRate = 22050;
    var duration = 0.5; // default half second
    if (type === 'powerup' || type === 'oneup') duration = 0.8;
    
    var numSamples = Math.floor(sampleRate * duration);
    var bufferLength = 44 + numSamples * 2;
    var buffer = Buffer.alloc(bufferLength);

    // Write WAV Header
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
    buffer.writeUInt16LE(16, 34); // 16-bit
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    var volume = 0.5;

    // Generate Samples
    for (var i = 0; i < numSamples; i++) {
        var t = i / sampleRate;
        var freq = 440;
        var val = 0;
        var decay = 1;

        if (type === 'coin') {
            freq = (t < 0.1) ? 987.77 : 1318.51; // B5 -> E6
            decay = Math.exp(-t * 10);
            val = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
        } else if (type === 'jump') {
            freq = 300 + (t * 800); // Slide up
            decay = Math.exp(-t * 8);
            val = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
        } else if (type === 'laser') {
            freq = 1200 - (t * 4000); // Slide down
            if (freq < 100) freq = 100;
            decay = Math.exp(-t * 15);
            var phase = (freq * t) % 1;
            val = phase > 0.3 ? 1 : -1;
        } else if (type === 'powerup') {
            var steps = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
            var stepIdx = Math.floor((t / duration) * steps.length);
            if (stepIdx >= steps.length) stepIdx = steps.length - 1;
            freq = steps[stepIdx];
            decay = 1 - (t / duration);
            val = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
        } else if (type === 'hit') {
            freq = 100 - (t * 100);
            if (freq < 10) freq = 10;
            decay = Math.exp(-t * 12);
            val = (Math.sin(2 * Math.PI * freq * t * 10) * Math.sin(2 * Math.PI * 400 * t)) > 0 ? 1 : -1;
        } else if (type === 'oneup') {
            var oSteps = [1318.51, 1567.98, 2093.00, 1567.98, 2637.02, 3135.96]; // E6, G6, C7, G6, E7, G7
            var oStepIdx = Math.floor((t / duration) * oSteps.length);
            if (oStepIdx >= oSteps.length) oStepIdx = oSteps.length - 1;
            freq = oSteps[oStepIdx];
            decay = 1.0;
            if (t > duration - 0.2) decay = Math.exp(-(t - (duration - 0.2)) * 15);
            val = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
        }

        var sample = Math.floor(val * 32767 * volume * decay);
        buffer.writeInt16LE(sample, 44 + i * 2);
    }

    fs.writeFileSync(filePath, buffer);
}

const sfxTypes = ['coin', 'jump', 'laser', 'powerup', 'hit', 'oneup'];

const outDir = path.join(__dirname, '..', 'examples', 'audio');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating SFX and converting to MP3...');

sfxTypes.forEach(type => {
    const wavPath = path.join(outDir, `${type}.wav`);
    const mp3Path = path.join(outDir, `${type}.mp3`);
    
    // 1. Generate WAV
    generateSFXWav(type, wavPath);
    
    // 2. Convert to strict 128k CBR MP3
    execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 128k "${mp3Path}"`, { stdio: 'ignore' });
    
    // Cleanup WAV
    fs.unlinkSync(wavPath);
    console.log(`Generated: ${type}.mp3`);
});

console.log('Done!');
