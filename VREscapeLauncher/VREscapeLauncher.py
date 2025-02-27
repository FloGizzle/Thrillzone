import tkinter as tk
from tkinter import ttk, messagebox
import requests
import subprocess
import json
import os
import psutil
from datetime import datetime
import sys
import time
import ctypes
import win32gui
import win32con
import win32process
import win32api
import win32com.client


class ConfigEditorWindow:
    def __init__(self, parent, config_path, providers):
        self.window = tk.Toplevel(parent)
        self.window.title("Configuration Editor")
        self.config_path = config_path
        self.providers = providers
        self.setup_ui()
        
    def setup_ui(self):
        # Create a notebook for tabs
        notebook = ttk.Notebook(self.window)
        notebook.pack(expand=True, fill='both', padx=10, pady=10)
        
        # Create a tab for each provider
        self.path_entries = {}
        for provider in self.providers:
            tab = ttk.Frame(notebook)
            notebook.add(tab, text=provider)
            
            # Add scrollbar and canvas for potentially long content
            canvas = tk.Canvas(tab)
            scrollbar = ttk.Scrollbar(tab, orient="vertical", command=canvas.yview)
            scrollable_frame = ttk.Frame(canvas)

            scrollable_frame.bind(
                "<Configure>",
                lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
            )

            canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
            canvas.configure(yscrollcommand=scrollbar.set)
            
            # Add path entries for each startup file
            self.path_entries[provider] = []
            startup_files = self.providers[provider]['startup_files']
            
            ttk.Label(scrollable_frame, text="Startup Files:", font=('Arial', 10, 'bold')).pack(pady=(10,5), anchor='w')
            
            for idx, file_info in enumerate(startup_files):
                frame = ttk.Frame(scrollable_frame)
                frame.pack(fill='x', padx=5, pady=2)
                
                ttk.Label(frame, text=f"Path {idx + 1}:").pack(side='left')
                entry = ttk.Entry(frame, width=50)
                entry.pack(side='left', padx=5)
                entry.insert(0, file_info['path'])
                
                # Create a dictionary to store all file info
                entry_info = {
                    'path_entry': entry,
                    'requires_admin': tk.BooleanVar(value=file_info.get('requires_admin', False)),
                    'wait_after': tk.StringVar(value=str(file_info.get('wait_after', 0)))
                }
                
                # Add admin checkbox
                admin_check = ttk.Checkbutton(frame, text="Requires Admin",
                                            variable=entry_info['requires_admin'])
                admin_check.pack(side='left', padx=5)
                
                # Add wait after entry
                ttk.Label(frame, text="Wait (s):").pack(side='left', padx=5)
                wait_entry = ttk.Entry(frame, width=5, textvariable=entry_info['wait_after'])
                wait_entry.pack(side='left')
                
                self.path_entries[provider].append(entry_info)
            
            # Games section
            ttk.Label(scrollable_frame, text="Games:", font=('Arial', 10, 'bold')).pack(pady=(20,5), anchor='w')
            games_frame = ttk.Frame(scrollable_frame)
            games_frame.pack(fill='x', padx=5)
            
            self.games_text = tk.Text(games_frame, height=5, width=50)
            self.games_text.pack(side='left', pady=5)
            self.games_text.insert('1.0', '\n'.join(self.providers[provider]['games']))
            
            # Pack the canvas and scrollbar
            canvas.pack(side="left", fill="both", expand=True)
            scrollbar.pack(side="right", fill="y")

        # Add Save button at the bottom
        ttk.Button(self.window, text="Save", command=self.save_config).pack(pady=10)
        
    def save_config(self):
        try:
            # Update the providers dictionary with new values
            for provider in self.providers:
                startup_files = []
                for entry_info in self.path_entries[provider]:
                    file_info = {
                        'path': entry_info['path_entry'].get(),
                        'requires_admin': entry_info['requires_admin'].get(),
                        'wait_after': float(entry_info['wait_after'].get())
                    }
                    startup_files.append(file_info)
                
                self.providers[provider]['startup_files'] = startup_files
                
                # Update games list
                games_text = self.games_text.get('1.0', 'end-1c')  # Get text without final newline
                self.providers[provider]['games'] = [game.strip() for game in games_text.split('\n') if game.strip()]
            
            # Read existing config
            with open(self.config_path, 'r') as f:
                config = json.load(f)
            
            # Update only the providers section
            config['providers'] = self.providers
            
            # Write back to file
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=4)
            
            messagebox.showinfo("Success", "Configuration saved successfully!")
            self.window.destroy()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save configuration: {str(e)}")


class AppLauncherApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Game Launcher")
        
        # Load configuration from external file
        self.load_config()
        
        # Create options button
        self.create_options_button()
        
        # Dictionary to store selections
        self.selections = {
            'provider': '',
            'game': '',
            'people': 0,
            'amount': 0.0
        }
        
        self.current_frame = None
        self.show_provider_selection()

    def create_options_button(self):
        options_frame = ttk.Frame(self.root)
        options_frame.grid(row=0, column=0, sticky='e', padx=5, pady=5)
        
        ttk.Button(options_frame, text="Settings", width=3,
                  command=self.show_options).grid(row=0, column=0)

    def show_options(self):
        if getattr(sys, 'frozen', False):
            application_path = os.path.dirname(sys.executable)
        else:
            application_path = os.path.dirname(os.path.abspath(__file__))
        
        config_path = os.path.join(application_path, 'config.json')
        ConfigEditorWindow(self.root, config_path, self.providers)

    def load_config(self):
        try:
            # Get the directory where the executable is located
            if getattr(sys, 'frozen', False):
                application_path = os.path.dirname(sys.executable)
            else:
                application_path = os.path.dirname(os.path.abspath(__file__))
            
            config_path = os.path.join(application_path, 'config.json')
            creds_path = os.path.join(application_path, 'credentials.json')
            
            with open(config_path, 'r') as f:
                config = json.load(f)
                
            self.providers = config['providers']
            self.spreadsheet_name = config['spreadsheet_name']
            self.credentials_path = creds_path
            
        except Exception as e:
            messagebox.showerror("Configuration Error", 
                               "Error loading configuration. Please ensure config.json and credentials.json are present.")
            self.root.quit()

    def is_process_running(self, process_name):
        for proc in psutil.process_iter(['name']):
            try:
                if proc.info['name'].lower() == process_name.lower():
                    return True
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        return False

    def show_provider_selection(self):
        self.clear_frame()
        frame = ttk.Frame(self.root, padding="10")
        frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        ttk.Label(frame, text="Select Provider:", font=('Arial', 12, 'bold')).grid(
            row=0, column=0, pady=10)
        
        for idx, provider in enumerate(self.providers.keys()):
            ttk.Button(frame, text=provider,
                      command=lambda p=provider: self.select_provider(p)).grid(
                          row=idx+1, column=0, pady=5, padx=20)
        
        self.current_frame = frame

    def select_provider(self, provider):
        self.selections['provider'] = provider
        self.show_game_selection()

    def show_game_selection(self):
        self.clear_frame()
        frame = ttk.Frame(self.root, padding="10")
        frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        ttk.Label(frame, text=f"Select Game for {self.selections['provider']}:",
                 font=('Arial', 12, 'bold')).grid(row=0, column=0, pady=10)
        
        games = self.providers[self.selections['provider']]['games']
        for idx, game in enumerate(games):
            ttk.Button(frame, text=game,
                      command=lambda g=game: self.select_game(g)).grid(
                          row=idx+1, column=0, pady=5, padx=20)
        
        ttk.Button(frame, text="Back",
                  command=self.show_provider_selection).grid(
                      row=len(games)+1, column=0, pady=10)
        
        self.current_frame = frame

    def select_game(self, game):
        self.selections['game'] = game
        self.show_people_input()

    def show_people_input(self):
        self.clear_frame()
        frame = ttk.Frame(self.root, padding="10")
        frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        ttk.Label(frame, text="Select number of people:",
                 font=('Arial', 12, 'bold')).grid(row=0, column=0, columnspan=3, pady=10)
        
        # Create buttons for 1-6 people in a 2x3 grid
        for i in range(6):
            row = i // 3
            col = i % 3
            ttk.Button(frame, text=str(i + 1),
                      command=lambda p=i+1: self.set_people(p)).grid(
                          row=row+1, column=col, pady=5, padx=5)
        
        ttk.Button(frame, text="Back",
                  command=self.show_game_selection).grid(
                      row=3, column=1, pady=10)
        
        self.current_frame = frame

    def set_people(self, people):
        self.selections['people'] = people
        # Calculate default amount based on number of people (59 per person)
        self.selections['amount'] = people * 59
        self.show_amount_input()

    def show_amount_input(self):
        self.clear_frame()
        frame = ttk.Frame(self.root, padding="10")
        frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        ttk.Label(frame, text="Enter amount paid:",
                 font=('Arial', 12, 'bold')).grid(row=0, column=0, pady=10)
        
        amount_entry = ttk.Entry(frame)
        amount_entry.grid(row=1, column=0, pady=5)
        # Set the default amount based on number of people
        amount_entry.insert(0, str(self.selections['amount']))
        
        ttk.Button(frame, text="Launch",
                  command=lambda: self.finish_and_launch(amount_entry.get())).grid(
                      row=2, column=0, pady=10)
        
        ttk.Button(frame, text="Back",
                  command=self.show_people_input).grid(
                      row=3, column=0, pady=5)
        
        self.current_frame = frame

    def finish_and_launch(self, amount):
        try:
            self.selections['amount'] = float(amount)
            self.update_spreadsheet()
            self.launch_provider_application()
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid amount")

    def find_window_handle(self, process_name):
        """Find window handles associated with a process name"""
        def callback(hwnd, handles):
            if win32gui.IsWindowVisible(hwnd):
                _, pid = win32process.GetWindowThreadProcessId(hwnd)
                try:
                    process = psutil.Process(pid)
                    if process.name().lower() == process_name.lower():
                        # Get window title to help with debugging
                        title = win32gui.GetWindowText(hwnd)
                        print(f"Found window: {title} for process: {process_name}")
                        handles.append(hwnd)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            return True
        
        handles = []
        win32gui.EnumWindows(callback, handles)
        return handles

    def activate_window(self, hwnd):
        """Activate window using simpler, less invasive methods"""
        try:
            # First try to restore if minimized
            placement = win32gui.GetWindowPlacement(hwnd)
            if placement[1] == win32con.SW_SHOWMINIMIZED:
                win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            
            # Send alt key to release any keyboard captures
            shell = win32com.client.Dispatch("WScript.Shell")
            shell.SendKeys('%')
            
            # Try to set as foreground window
            win32gui.SetForegroundWindow(hwnd)
            
            return True
        except Exception as e:
            print(f"Error in activate_window: {str(e)}")
            return False

    def bring_window_to_front(self, process_name):
        """Find and activate the window for the given process"""
        handles = self.find_window_handle(process_name)
        
        if handles:
            # Try each handle found
            for hwnd in handles:
                try:
                    # Try activation multiple times with delay
                    for attempt in range(3):
                        if self.activate_window(hwnd):
                            print(f"Successfully activated window on attempt {attempt + 1}")
                            return True
                        time.sleep(0.2)
                except Exception as e:
                    print(f"Error with window handle: {str(e)}")
                    continue
            
            print(f"Failed to activate any windows for {process_name}")
            return False
        else:
            print(f"No visible windows found for {process_name}")
            return False

    def launch_provider_application(self):
        provider_info = self.providers[self.selections['provider']]
        startup_files = provider_info['startup_files']
        
        try:
            for file_info in startup_files:
                file_path = file_info['path']
                wait_time = file_info.get('wait_after', 0)
                requires_admin = file_info.get('requires_admin', False)
                
                if not os.path.exists(file_path):
                    raise FileNotFoundError(f"File not found: {file_path}")
                
                _, ext = os.path.splitext(file_path)
                process_name = os.path.basename(file_path)
                
                # Check if process is running and try to activate window
                if self.is_process_running(process_name):
                    print(f"Process {process_name} is running, attempting to bring to front...")
                    # Give the window a moment to be ready
                    time.sleep(0.5)
                    
                    if self.bring_window_to_front(process_name):
                        print(f"Successfully brought {process_name} to front")
                        continue
                    else:
                        print(f"Failed to bring {process_name} to front, launching new instance")
                
                # Launch new instance if needed
                if ext.lower() == '.bat':
                    if requires_admin:
                        success = self.run_as_admin(file_path)
                        if not success:
                            raise Exception("Failed to launch batch file with admin rights")
                    else:
                        subprocess.Popen(file_path, shell=True).wait()
                        
                elif ext.lower() == '.exe':
                    try:
                        working_dir = os.path.dirname(file_path)
                        
                        if self.selections['provider'].lower() == 'vr cave':
                            server_args = "spaceLobby?listen?bIsLanMatch=1 -LANPLAY -sessionserver -autospectate -nohmd"
                            
                            if requires_admin:
                                success = self.run_as_admin(file_path, server_args)
                                if not success:
                                    raise Exception("Failed to launch server with admin rights")
                            else:
                                subprocess.Popen([file_path] + server_args.split(), 
                                               cwd=working_dir, shell=True)
                        else:
                            if requires_admin:
                                success = self.run_as_admin(file_path)
                                if not success:
                                    raise Exception("Failed to launch application with admin rights")
                            else:
                                subprocess.Popen([file_path], cwd=working_dir, shell=True)
                    except Exception as exe_error:
                        raise Exception(f"Error launching {file_path}: {str(exe_error)}")
                else:
                    raise Exception(f"Unsupported file type: {ext}")
                
                if wait_time > 0:
                    time.sleep(wait_time)
                    
        except Exception as e:
            detailed_error = f"Failed to launch {self.selections['provider']} application:\n\n"
            detailed_error += f"Error: {str(e)}\n\n"
            detailed_error += "Please verify that:\n"
            detailed_error += "1. The path to the application is correct\n"
            detailed_error += "2. The file is a valid Windows executable (.exe) or batch file (.bat)\n"
            detailed_error += "3. You have permission to run the application\n"
            detailed_error += f"\nFile path: {file_path}"
            
            messagebox.showerror("Launch Error", detailed_error)
            return
        
        self.root.quit()

    def run_as_admin(self, file_path, args=None):
        try:
            if args is None:
                args = ''
                
            exe_path = os.path.abspath(file_path)
            working_dir = os.path.dirname(exe_path)
            
            response = ctypes.windll.shell32.ShellExecuteW(
                None,
                'runas',
                exe_path,
                args,
                working_dir,
                1
            )
            
            return response > 32
            
        except Exception as e:
            messagebox.showerror("Elevation Error", f"Failed to run as admin: {str(e)}")
            return False

    def clear_frame(self):
        if self.current_frame:
            self.current_frame.destroy()

    def update_spreadsheet(self):
        try:
            # Define the URL of your Google Sheets Web App
            web_app_url = "https://script.google.com/macros/s/AKfycbxxI0QCgGAAhz1W7DO_6MDwdI5QGP1xwS8Uq3w7q_p19zkzKtnlMehOtLdGwzfX68PU/exec"
            
            # Get location from config
            location = ""
            if getattr(sys, 'frozen', False):
                application_path = os.path.dirname(sys.executable)
            else:
                application_path = os.path.dirname(os.path.abspath(__file__))
            
            config_path = os.path.join(application_path, 'config.json')
            with open(config_path, 'r') as f:
                config = json.load(f)
                location = config.get('location', '')

            # Determine 'where' based on location
            where = ""
            print(location)
            if "QT" in location:
                if "EQ" in location:
                    where = "Escapequest"
                elif "TZ" in location:
                    where = "Thrillzone"
                print(where)
                # Prepare the data payload
                payload = {
                    "date": datetime.now().strftime('%d/%m/%Y'),
                    "time": datetime.now().strftime('%H:%M'),
                    "provider": self.selections['provider'],
                    "where": where,  # Add the new where field
                    "game": self.selections['game'],
                    "amount": self.selections['amount'],
                    "people": self.selections['people']
                }
            else:
                # Prepare the data payload
                payload = {
                    "date": datetime.now().strftime('%d/%m/%Y'),
                    "time": datetime.now().strftime('%H:%M'),
                    "provider": self.selections['provider'],
                    "game": self.selections['game'],
                    "amount": self.selections['amount'],
                    "people": self.selections['people']
                }
            
            # Make the POST request
            response = requests.post(web_app_url, json=payload)
            
            # Check the response
            print(response.text)
            if response.status_code != 200:
                raise Exception(f"Web App Error: {response.text}")
        
        except Exception as e:
            # Show an error message in case of failure
            messagebox.showerror(
                "Spreadsheet Error",
                f"Failed to update spreadsheet. Error: {str(e)}"
            )
if __name__ == '__main__':
    root = tk.Tk()
    app = AppLauncherApp(root)
    root.mainloop()