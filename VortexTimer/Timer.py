import tkinter as tk
import threading
import time
import socket

class TimerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Timer App")

        self.timer_running = False
        self.stop_signal = False

        self.btn_30 = tk.Button(root, text="30 Minutes", command=lambda: self.start_timer(30))
        self.btn_45 = tk.Button(root, text="45 Minutes", command=lambda: self.start_timer(45))
        self.btn_stop = tk.Button(root, text="Stop Timer", command=self.stop_timer)

        self.btn_30.pack(padx=20, pady=10)
        self.btn_45.pack(padx=20, pady=10)

        self.label = tk.Label(root, text="", font=("Arial", 16))
        self.label.pack(pady=10)

    def start_timer(self, minutes):
        if self.timer_running:
            return
        self.timer_running = True
        self.stop_signal = False

        # Hide start buttons, show stop
        self.btn_30.pack_forget()
        self.btn_45.pack_forget()
        self.btn_stop.pack(pady=10)

        self.root.iconify()  # minimize
        threading.Thread(target=self.run_timer, args=(minutes,), daemon=True).start()

    def stop_timer(self):
        self.stop_signal = True

    def run_timer(self, minutes):
        time.sleep(10)  # 10-second delay

        total_seconds = minutes * 60
        self.send_time_to_pi(minutes)
        while total_seconds >= 0 and not self.stop_signal:
            mins, secs = divmod(total_seconds, 60)
            timer_str = f"{mins:02d}:{secs:02d}"
            self.update_label(timer_str)
            time.sleep(1)
            total_seconds -= 1

        self.end_timer()

    def update_label(self, text):
        self.label.after(0, lambda: self.label.config(text=text))

    def end_timer(self):
        self.root.after(0, self.reset_ui)

    def reset_ui(self):
        self.timer_running = False
        self.btn_stop.pack_forget()
        self.btn_30.pack(padx=20, pady=10)
        self.btn_45.pack(padx=20, pady=10)
        self.label.config(text="Finished!")
        self.root.deiconify()
        self.root.lift()
        self.root.attributes('-topmost', 1)
        self.root.after(500, lambda: self.root.attributes('-topmost', 0))

    def send_time_to_pi(self, minutes):
        PI_IP = "192.168.68.104"  # Replace with your Pi's actual IP
        PORT = 5005
        message = f"START:{minutes}"

        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((PI_IP, PORT))
                s.sendall(message.encode())
            print(f"Sent countdown start for {minutes} minutes")
        except Exception as e:
            print(f"Failed to send: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = TimerApp(root)
    root.mainloop()
