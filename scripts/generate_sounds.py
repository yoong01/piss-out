"""Generates placeholder toilet-themed sound effects (no external assets needed).

Run: python3 scripts/generate_sounds.py
Produces assets/sounds/plop.wav (notification) and assets/sounds/flush.wav (success).
These are synthetic placeholders -- swap with real recorded/licensed SFX before shipping.
"""
import math
import random
import struct
import wave
import os

SAMPLE_RATE = 44100
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "sounds")


def write_wav(path, samples):
    with wave.open(path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        frames = b"".join(struct.pack("<h", max(-32767, min(32767, int(s)))) for s in samples)
        f.writeframes(frames)


def envelope(i, n, attack=0.02, release=0.3):
    a = int(n * attack)
    r = int(n * release)
    if i < a:
        return i / max(a, 1)
    if i > n - r:
        return max(0.0, (n - i) / max(r, 1))
    return 1.0


def make_plop():
    """Short comedic 'plop' -- a pitch-dropping sine blip with a click transient."""
    duration = 0.32
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 320 * math.exp(-6 * t) + 70
        val = math.sin(2 * math.pi * freq * t)
        click = 4000 * math.exp(-t * 200) if t < 0.01 else 0
        env = envelope(i, n, attack=0.005, release=0.6)
        samples.append((val * 9000 + click) * env)
    return samples


def make_flush():
    """Swirling flush -- filtered noise sweep with a low rumble tail."""
    duration = 1.4
    n = int(SAMPLE_RATE * duration)
    samples = []
    prev = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        noise = random.uniform(-1, 1)
        # crude low-pass filter for a "whooshy" swirl instead of harsh static
        prev = prev * 0.86 + noise * 0.14
        swirl_mod = 0.5 + 0.5 * math.sin(2 * math.pi * (3 + 5 * t) * t)
        rumble = math.sin(2 * math.pi * (90 - 40 * t) * t) * 0.35
        env = envelope(i, n, attack=0.05, release=0.55)
        val = (prev * swirl_mod * 0.8 + rumble) * env
        samples.append(val * 9000)
    return samples


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    write_wav(os.path.join(OUT_DIR, "plop.wav"), make_plop())
    write_wav(os.path.join(OUT_DIR, "flush.wav"), make_flush())
    print("Wrote plop.wav and flush.wav to", OUT_DIR)


if __name__ == "__main__":
    main()
