import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox
from PIL import Image, ImageTk
import win32print
import win32api
import os
import time
import threading
import subprocess

class DualScreenImageViewer:
    def __init__(self):
        # Create control window (first screen)
        self.control_window = tk.Tk()
        self.control_window.title("Image Viewer Controls")
        self.control_window.geometry("900x600+0+0")  # Position on first screen
        
        # Create display window (second screen)
        self.display_window = tk.Toplevel(self.control_window)
        self.display_window.title("Fullscreen Image Display")
        
        # Make it fullscreen after positioning
        self.display_window.geometry("1024x768+100+100")  # Or any starting size and position
        self.display_window.resizable(True, True)         # Allow resizing
        
        # Variables
        self.main_folder = ""
        self.interrupt_folder = ""
        self.interrupt_duration = 60  # Default 60 seconds
        self.main_images = []
        self.interrupt_images = []
        self.current_index = 0
        self.paused = False
        self.showing_interrupt = False
        self.interrupt_timer = None
        self.current_interrupt_path = None
        self.slideshow_active = False
        self.selected_thumbnail = None  # Track currently selected thumbnail

        self.control_window.protocol("WM_DELETE_WINDOW", self.on_close)
        
        # Set up the display frame (on second screen)
        self.display_frame = tk.Frame(self.display_window, bg="black")
        self.display_frame.pack(fill=tk.BOTH, expand=True)
        
        # Set up the image label (on second screen)
        self.image_label = tk.Label(self.display_frame, bg="black")
        self.image_label.pack(fill=tk.BOTH, expand=True)

        # refresh folder
        self.auto_refresh_interval = 60000  # in milliseconds (60,000 ms = 60 seconds)
        self.auto_refresh_job = None
        
        # Set up the control panel (on first screen)
        self.setup_control_panel()
        
        # Set up key bindings
        self.setup_key_bindings()
        
        # Initialize with a message
        self.show_message("Please select folders using the Setup button")
    
    def setup_control_panel(self):
        # Main control frame
        control_frame = tk.Frame(self.control_window)
        control_frame.pack(fill=tk.BOTH, expand=True)
        
        # Buttons frame
        buttons_frame = tk.Frame(control_frame)
        buttons_frame.pack(pady=20)
        
        # Create buttons
        setup_btn = tk.Button(buttons_frame, text="Setup", command=self.setup_folders, width=15, height=2)
        play_btn = tk.Button(buttons_frame, text="Play/Pause", command=self.toggle_play, width=15, height=2)
        prev_btn = tk.Button(buttons_frame, text="Previous", command=self.previous_image, width=15, height=2)
        next_btn = tk.Button(buttons_frame, text="Next", command=self.next_image, width=15, height=2)
        print_btn = tk.Button(buttons_frame, text="Print", command=self.print_interrupt_image, width=15, height=2)
        refresh_btn = tk.Button(buttons_frame, text="Refresh", command=self.refresh_interrupt_images, width=15, height=2)
        
        # Pack buttons
        setup_btn.grid(row=0, column=0, padx=10, pady=10)
        play_btn.grid(row=0, column=1, padx=10, pady=10)
        prev_btn.grid(row=0, column=2, padx=10, pady=10)
        next_btn.grid(row=0, column=3, padx=10, pady=10)
        print_btn.grid(row=0, column=4, padx=10, pady=10)
        refresh_btn.grid(row=0, column=5, padx=10, pady=10)
        
        # Status display
        self.status_label = tk.Label(control_frame, text="Status: Ready", font=("Arial", 12))
        self.status_label.pack(pady=10)
        
        # Current image info
        self.image_info = tk.Label(control_frame, text="", font=("Arial", 10))
        self.image_info.pack(pady=5)

        
        # Thumbnails section label
        thumbnails_label = tk.Label(control_frame, text="Pictures of today (Click to show)", font=("Arial", 12, "bold"))
        thumbnails_label.pack(pady=(20, 10))

        # Canvas and scrollbar for thumbnails
        thumbnail_canvas_frame = tk.Frame(control_frame)
        thumbnail_canvas_frame.pack(fill=tk.BOTH, expand=True)

        self.thumbnail_canvas = tk.Canvas(thumbnail_canvas_frame, height=300)  # Adjust height as needed
        scrollbar = tk.Scrollbar(thumbnail_canvas_frame, orient="vertical", command=self.thumbnail_canvas.yview)
        self.thumbnail_canvas.configure(yscrollcommand=scrollbar.set)

        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.thumbnail_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self.thumbnails_frame = tk.Frame(self.thumbnail_canvas)
        self.thumbnail_canvas.create_window((0, 0), window=self.thumbnails_frame, anchor="nw")

        self.thumbnails_frame.bind("<Configure>", lambda e: self.thumbnail_canvas.configure(
            scrollregion=self.thumbnail_canvas.bbox("all")))
        
        def _on_mousewheel(event):
            self.thumbnail_canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

        # Bind mousewheel scrolling when cursor is over control_frame
        self.thumbnail_canvas.bind_all("<Enter>", lambda e: self.thumbnail_canvas.bind_all("<MouseWheel>", _on_mousewheel))
        self.thumbnail_canvas.bind_all("<Leave>", lambda e: self.thumbnail_canvas.unbind_all("<MouseWheel>"))
    
    def setup_key_bindings(self):
        self.control_window.bind('<Escape>', lambda e: self.exit_app())
        self.display_window.bind('<Escape>', lambda e: self.exit_app())
        self.control_window.bind('<space>', lambda e: self.toggle_play())
        self.display_window.bind('<space>', lambda e: self.toggle_play())
        self.control_window.bind('<Left>', lambda e: self.previous_image())
        self.display_window.bind('<Left>', lambda e: self.previous_image())
        self.control_window.bind('<Right>', lambda e: self.next_image())
        self.display_window.bind('<Right>', lambda e: self.next_image())
        self.control_window.bind('<p>', lambda e: self.print_interrupt_image())
        self.display_window.bind('<p>', lambda e: self.print_interrupt_image())

    def exit_app(self):
        self.slideshow_active = False
        self.control_window.destroy()
        self.display_window.destroy()
    
    def setup_folders(self):
        self.selected_thumbnail = None
        self.main_folder = r"C:\Users\Thrillzone Arena\Desktop\Vortex\Daily Pictures\Favorites"

        #TEST
        #self.main_folder = r"C:\Users\TestingLab\Pictures\PhotoTestFolder"
        
        # Ask for interrupt folder
        self.interrupt_folder = filedialog.askdirectory(title="Select Todays Images Folder")
        if not self.interrupt_folder:
            return
        
        # Load images from folders
        self.load_images()
        
        # Start the slideshow
        self.start_slideshow()

        self.refresh_interrupt_images()  # Start auto-refresh loop
    
    def load_images(self):
        # Load main images
        self.main_images = []
        if self.main_folder:
            for file in os.listdir(self.main_folder):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                    self.main_images.append(os.path.join(self.main_folder, file))
        
        # Sort images alphabetically
        self.main_images.sort()
        
       # Load interrupt images sorted by file creation time (Windows only)
        self.interrupt_images = []
        if self.interrupt_folder:
            image_files = [
                file for file in os.listdir(self.interrupt_folder)
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))
            ]
            image_files.sort(key=lambda f: os.path.getctime(os.path.join(self.interrupt_folder, f)))
            self.interrupt_images = [os.path.join(self.interrupt_folder, f) for f in image_files]
        
        # Create thumbnails for interrupt images
        self.create_thumbnails()

        self.status_label.config(text=f"Status: Showing Slideshow")
    
    def create_thumbnails(self):
        self.selected_thumbnail = None
        for widget in self.thumbnails_frame.winfo_children():
            widget.destroy()

        columns = 4  # 5 thumbnails per row
        for i, img_path in enumerate(self.interrupt_images):
            try:
                img = Image.open(img_path)
                img.thumbnail((200, 200))
                photo = ImageTk.PhotoImage(img)

                row = i // columns
                col = i % columns

                thumb_frame = tk.Frame(self.thumbnails_frame, bd=2, relief="flat", bg=self.thumbnails_frame.cget("bg"))
                thumb_frame.grid(row=row, column=col, padx=5, pady=5)

                thumb_label = tk.Label(thumb_frame, image=photo)
                thumb_label.image = photo
                thumb_label.pack()

                name_label = tk.Label(thumb_frame, text=os.path.basename(img_path), font=("Arial", 8))
                name_label.pack()

                thumb_label.bind("<Button-1>", lambda e, idx=i, frame=thumb_frame: self.show_interrupt_image(idx, frame))
                name_label.bind("<Button-1>", lambda e, idx=i, frame=thumb_frame: self.show_interrupt_image(idx, frame))

            except Exception as e:
                print(f"Error creating thumbnail for {img_path}: {e}")

    
    def refresh_interrupt_images(self):
    # Load interrupt images sorted by creation/modification time (newest first)
        self.interrupt_images = []
        if self.interrupt_folder:
            files = [
                os.path.join(self.interrupt_folder, f)
                for f in os.listdir(self.interrupt_folder)
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))
            ]
            self.interrupt_images = sorted(files, key=os.path.getmtime, reverse=True)
            
            # Recreate thumbnails
            self.create_thumbnails()

    def start_slideshow(self):
        if not self.main_images:
            self.show_message("No images found in the main folder!")
            return
        
        # Reset variables
        self.current_index = 0
        self.paused = False
        self.showing_interrupt = False
        self.slideshow_active = True
        
        # Show first image
        self.show_current_image()
        
        # Start the slideshow thread
        threading.Thread(target=self.slideshow_thread, daemon=True).start()
    
    def slideshow_thread(self):
        while self.slideshow_active:
            # Only advance to next image if:
            # 1. Not paused
            # 2. Not showing an interrupt image
            # 3. Slideshow is active
            if (not self.paused and 
                not self.showing_interrupt and 
                self.slideshow_active):
                time.sleep(60)  # Wait 3 seconds between images
                
                # Check again before advancing (in case status changed during wait)
                if (not self.paused and 
                    not self.showing_interrupt and 
                    self.slideshow_active):
                    self.control_window.after(0, self.next_image)
            
            time.sleep(0.1)  # Small delay to prevent CPU hogging
    
    def show_current_image(self):
        if not self.main_images:
            return
        
        try:
            # Open and resize the image to fit the screen
            img_path = self.main_images[self.current_index]
            img = Image.open(img_path)
            
            self.display_frame.update_idletasks()
            display_width = self.display_frame.winfo_width()
            display_height = self.display_frame.winfo_height()

            # Resize to fit within the display frame
            img_width, img_height = img.size
            ratio = min(display_width / img_width, display_height / img_height)
            new_width = int(img_width * ratio)
            new_height = int(img_height * ratio)

            img = img.resize((new_width, new_height), Image.LANCZOS)
            photo = ImageTk.PhotoImage(img)

            self.image_label.config(image=photo, text="")
            self.image_label.image = photo  # Keep reference
            
        except Exception as e:
            print(f"Error showing image: {e}")
            self.status_label.config(text=f"Error: {str(e)}")
    
    def show_interrupt_image(self, index, frame):
        if not self.interrupt_images or index >= len(self.interrupt_images):
            return
        
        # Clear previous selection
        if self.selected_thumbnail:
            self.selected_thumbnail.config(bg=self.thumbnails_frame.cget("bg"))

        # Highlight current selection
        frame.config(bg="red")
        self.selected_thumbnail = frame
        
        try:
            # Set flag to indicate we're showing an interrupt image
            # This will pause the automatic advancement in the slideshow thread
            self.showing_interrupt = True
            
            # Cancel any existing interrupt timer
            if self.interrupt_timer:
                self.control_window.after_cancel(self.interrupt_timer)
            
            img_path = os.path.abspath(self.interrupt_images[index])  # Ensures full valid path
            self.current_interrupt_path = img_path  # Store path for printing

            img = Image.open(img_path)
            self.current_interrupt_path = img_path
            print(f"whats the path: {img_path}")
            
            self.display_frame.update_idletasks()
            display_width = self.display_frame.winfo_width()
            display_height = self.display_frame.winfo_height()

            # Resize to fit within the display frame
            img_width, img_height = img.size
            ratio = min(display_width / img_width, display_height / img_height)
            new_width = int(img_width * ratio)
            new_height = int(img_height * ratio)

            img = img.resize((new_width, new_height), Image.LANCZOS)
            photo = ImageTk.PhotoImage(img)

            self.image_label.config(image=photo, text="")
            self.image_label.image = photo  # Keep reference
            
            # Update status on control window
            filename = os.path.basename(img_path)
            self.status_label.config(text=f"Status: Showing selected image")
            self.image_info.config(text=f"Showing: {filename}")
            
            # Set timer to return to slideshow
            self.interrupt_timer = self.control_window.after(
                self.interrupt_duration * 1000, self.return_to_slideshow)
        except Exception as e:
            print(f"Error showing interrupt image: {e}")
            self.status_label.config(text=f"Error: {str(e)}")
            self.showing_interrupt = False
    
    def return_to_slideshow(self):
        # Resume the regular slideshow
        self.showing_interrupt = False
        self.show_current_image()  # Show the current main image again
        self.status_label.config(text="Status: Returned to main slideshow")

        # Clear thumbnail highlight
        if self.selected_thumbnail:
            self.selected_thumbnail.config(bg=self.thumbnails_frame.cget("bg"))
            self.selected_thumbnail = None

        # ✅ Refresh the thumbnails to reflect any folder changes
        self.refresh_interrupt_images()
    
    def next_image(self):
        if not self.main_images or self.showing_interrupt:
            return
        
        self.current_index = (self.current_index + 1) % len(self.main_images)
        self.show_current_image()
        
        # Refresh interrupt images every time a new main image is shown
        self.refresh_interrupt_images()
    
    def previous_image(self):
        if not self.main_images or self.showing_interrupt:
            return
        
        self.current_index = (self.current_index - 1) % len(self.main_images)
        self.show_current_image()
    
    def toggle_play(self):
        # Don't toggle if we're showing an interrupt image
        if self.showing_interrupt:
            return
            
        self.paused = not self.paused
        status = "Paused" if self.paused else "Playing"
        self.status_label.config(text=f"Status: {status}")
    
    def show_message(self, message):
        # Show message on display window
        self.image_label.config(image="")
        self.image_label.config(text=message, fg="white", font=("Arial", 24))
        
        # Update status on control window
        self.status_label.config(text=f"Status: {message}")

    def on_close(self):
        if messagebox.askokcancel("Exit", "Are you sure you want to exit the application?"):
            self.exit_app()

    def print_interrupt_image(self):
        if not hasattr(self, "current_interrupt_path") or not self.current_interrupt_path:
            self.status_label.config(text="Status: No image selected to print")
            return

        try:
            image_path = os.path.abspath(self.current_interrupt_path)

            # Make sure path uses backslashes and is quoted properly
            image_path = image_path.replace("/", "\\")
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")

            # Set your printer name here
            printer_name = "DP-DS620"
            win32print.SetDefaultPrinter(printer_name)

            # Open image with default viewer and silently print
            win32api.ShellExecute(
                0,
                "print",
                image_path,
                None,
                ".",
                0
            )

            self.status_label.config(text="Status: Sent image to printer")

        except Exception as e:
            print(f"Error printing image: {e}")
            self.status_label.config(text=f"Error printing image: {str(e)}")


if __name__ == "__main__":
    app = DualScreenImageViewer()
    app.control_window.mainloop()