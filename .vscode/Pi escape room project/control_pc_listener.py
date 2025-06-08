import requests
import subprocess
import time

PI_IP = "192.168.1.50"  # Replace with the IP of the Pi Zero
STREAM_URL = "http://CONTROL_PC_IP:8000/room_stream"  # Stream URL (Icecast or HTTP)

def start_stream():
    r = requests.post(f"http://{PI_IP}:5001/start")
    print(r.json())

def stop_stream():
    r = requests.post(f"http://{PI_IP}:5001/stop")
    print(r.json())

def listen_stream():
    print("Starting VLC to listen to stream...")
    subprocess.Popen(["vlc", STREAM_URL])

if __name__ == "__main__":
    start_stream()
    time.sleep(2)
    listen_stream()
    input("Press Enter to stop listening...")
    stop_stream()
