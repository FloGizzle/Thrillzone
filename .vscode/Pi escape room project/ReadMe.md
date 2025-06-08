# Escape Room Live Mic Streaming Demo

This setup lets a control PC trigger live mic streaming from a Raspberry Pi Zero inside an escape room, and listen to the audio remotely using VLC.

---

## Components

- **pi_stream_server.py** runs on each Pi Zero
- **control_pc_listener.py** runs on the control PC

---

## Setup on the Pi Zero

1. Install required packages:

```bash
sudo apt update
sudo apt install ffmpeg python3-pip
pip3 install flask
