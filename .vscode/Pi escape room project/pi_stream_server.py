from flask import Flask, request, jsonify
import subprocess
import threading

app = Flask(__name__)
ffmpeg_process = None

# Set this to your actual mic device (use `arecord -l` to find it)
MIC_DEVICE = "hw:1"
# Replace with the stream server you're pushing to (like Icecast or HTTP server)
STREAM_URL = "http://CONTROL_PC_IP:8000/room_stream"

def start_stream():
    global ffmpeg_process
    if ffmpeg_process is not None:
        return
    cmd = [
        "ffmpeg",
        "-f", "alsa",
        "-ac", "1",
        "-i", MIC_DEVICE,
        "-codec:a", "mp3",
        "-f", "mp3",
        STREAM_URL
    ]
    ffmpeg_process = subprocess.Popen(cmd)

def stop_stream():
    global ffmpeg_process
    if ffmpeg_process:
        ffmpeg_process.terminate()
        ffmpeg_process = None

@app.route("/start", methods=["POST"])
def start():
    threading.Thread(target=start_stream).start()
    return jsonify({"status": "stream started"})

@app.route("/stop", methods=["POST"])
def stop():
    stop_stream()
    return jsonify({"status": "stream stopped"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
