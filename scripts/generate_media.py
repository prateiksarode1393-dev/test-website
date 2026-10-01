import os
import wave
import struct

# Directories
VIDEO_DIR = 'public/videos'
AUDIO_DIR = 'public/audio'

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

def create_dummy_file(path, magic_bytes):
    with open(path, 'wb') as f:
        f.write(magic_bytes)
        f.write(b'\x00' * 1024)  # Add some padding to avoid 0-byte files

def create_wav_file(path):
    # Create a tiny valid WAV file (sine wave)
    with wave.open(path, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(44100)
        # Write 0.1 seconds of silence
        wav_file.writeframes(b'\x00' * 8820)

# Video Magic Bytes
VIDEO_MAGIC = {
    'test.mov': b'\x00\x00\x00\x14ftypqt',
    'test.avi': b'RIFF\x00\x00\x00\x00LIST',
    'test.wmv': b'\x00\x00\x00\x18ftypwmv',
    'test.flv': b'FLV\x01',
    'test.m4v': b'\x00\x00\x00\x14ftypm4v',
    'test.3gp': b'\x00\x00\x00\x14ftyp3gp',
    'test.mkv': b'\x1a\x45\xdf\xa3',
    'test.ogv': b'OggS',
}

# Audio Magic Bytes
AUDIO_MAGIC = {
    'test.mp3': b'\xff\xfb\x90\x44',
    'test.ogg': b'OggS',
    'test.aac': b'\xff\xf1',
    'test.m4a': b'\x00\x00\x00\x14ftypM4A',
    'test.flac': b'fLaC',
    'test.aiff': b'FORM',
    'test.mid': b'MThd',
    'test.wma': b'\x57\x4d\x41\x00',
    'test.opus': b'OggS',
}

print("Generating video files...")
for filename, magic in VIDEO_MAGIC.items():
    path = os.path.join(VIDEO_DIR, filename)
    create_dummy_file(path, magic)
    print(f"Created {path}")

print("\nGenerating audio files...")
# Special case for WAV
create_wav_file(os.path.join(AUDIO_DIR, 'test.wav'))
print("Created public/audio/test.wav")

for filename, magic in AUDIO_MAGIC.items():
    path = os.path.join(AUDIO_DIR, filename)
    create_dummy_file(path, magic)
    print(f"Created {path}")

print("\nMedia generation complete.")
