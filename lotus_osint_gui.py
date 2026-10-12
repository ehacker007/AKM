#!/usr/bin/env python3
"""
LOTUS OSINT - Cyber Intelligence HUD Desktop GUI (Jarvis Edition)
Native Python Tkinter Desktop Interface with Burning Sun Center,
Dense Lotus Feather Plumes, and Dot-Connection Reconstruction.

Run in Linux Terminal:
    sudo apt install python3-tk   # If needed
    python3 lotus_osint_gui.py
"""

import tkinter as tk
from tkinter import messagebox
import math
import time
import threading

# Color Palette (Jarvis Holographic Cyber Aesthetics)
BG_COLOR = "#000000"
PANEL_BG = "#030712"
CYAN_ACCENT = "#38bdf8"
CYAN_BRIGHT = "#00f0ff"
CYAN_DARK = "#0369a1"
SUN_WHITE = "#ffffff"
BREACH_RED = "#f43f5e"
TEXT_COLOR = "#e0f2fe"

class LotusOsintApp:
    def __init__(self, root):
        self.root = root
        self.root.title("LOTUS OSINT - Jarvis Cyber Intelligence HUD")
        self.root.geometry("1100x850")
        self.root.configure(bg=BG_COLOR)
        self.root.minsize(800, 600)

        # State
        self.zoom = 1.0
        self.target_handle = "tonystark"
        self.is_scanning = False
        self.rotation_phase = 0

        self.setup_ui()
        self.draw_hologram()

    def setup_ui(self):
        # Sleek Minimal Top Floating Input Bar
        top_frame = tk.Frame(self.root, bg=PANEL_BG, pady=8, padx=12, highlightthickness=1, highlightbackground=CYAN_DARK)
        top_frame.pack(fill=tk.X, side=tk.TOP)

        tk.Label(top_frame, text="⚡ LOTUS OSINT", font=("Helvetica", 12, "bold"), fg=CYAN_BRIGHT, bg=PANEL_BG).pack(side=tk.LEFT, padx=(0, 15))
        tk.Label(top_frame, text="@", font=("Courier", 12, "bold"), fg=CYAN_BRIGHT, bg=PANEL_BG).pack(side=tk.LEFT)

        self.entry_handle = tk.Entry(top_frame, font=("Courier", 11, "bold"), bg="#020617", fg=CYAN_BRIGHT, insertbackground=CYAN_BRIGHT, width=20)
        self.entry_handle.insert(0, self.target_handle)
        self.entry_handle.pack(side=tk.LEFT, padx=5)
        self.entry_handle.bind("<Return>", lambda e: self.start_recon())

        btn_recon = tk.Button(top_frame, text="CONNECT DOTS", font=("Helvetica", 9, "bold"), bg=CYAN_DARK, fg="white", activebackground=CYAN_BRIGHT, activeforeground="black", command=self.start_recon)
        btn_recon.pack(side=tk.LEFT, padx=8)

        # Zoom Controls
        btn_zoom_in = tk.Button(top_frame, text="+ Zoom", font=("Courier", 9, "bold"), bg="#0f172a", fg=CYAN_BRIGHT, command=self.zoom_in)
        btn_zoom_in.pack(side=tk.RIGHT, padx=3)

        btn_zoom_out = tk.Button(top_frame, text="- Zoom", font=("Courier", 9, "bold"), bg="#0f172a", fg=CYAN_BRIGHT, command=self.zoom_out)
        btn_zoom_out.pack(side=tk.RIGHT, padx=3)

        btn_reset = tk.Button(top_frame, text="Reset", font=("Courier", 9), bg="#0f172a", fg=TEXT_COLOR, command=self.reset_view)
        btn_reset.pack(side=tk.RIGHT, padx=3)

        # 100% Pure Canvas Focus
        self.canvas = tk.Canvas(self.root, bg=BG_COLOR, highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        self.canvas.bind("<Configure>", lambda e: self.draw_hologram())

    def zoom_in(self):
        self.zoom = min(self.zoom * 1.25, 3.5)
        self.draw_hologram()

    def zoom_out(self):
        self.zoom = max(self.zoom * 0.8, 0.4)
        self.draw_hologram()

    def reset_view(self):
        self.zoom = 1.0
        self.draw_hologram()

    def start_recon(self):
        handle = self.entry_handle.get().strip()
        if not handle:
            return
        self.target_handle = handle
        threading.Thread(target=self._recon_worker, daemon=True).start()

    def _recon_worker(self):
        self.is_scanning = True
        time.sleep(0.5)
        self.is_scanning = False
        self.root.after(0, self.draw_hologram)

    def draw_hologram(self):
        self.canvas.delete("all")
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()
        if w < 10 or h < 10:
            w, h = 1000, 750

        cx, cy = w // 2, h // 2

        # 1. Background Grid & Orbital Rings
        for r in [90, 160, 240, 320, 400]:
            scaled_r = r * self.zoom
            self.canvas.create_oval(cx - scaled_r, cy - scaled_r, cx + scaled_r, cy + scaled_r, outline=CYAN_DARK, dash=(3, 6), width=1)

        # 2. 16 Outer Feather Plumes with dense feather barbs
        petal_count = 16
        points = []
        for i in range(petal_count):
            angle_deg = i * (360 / petal_count)
            rad = math.radians(angle_deg - 90)
            length = 310 * self.zoom
            tip_x = cx + length * math.cos(rad)
            tip_y = cy + length * math.sin(rad)
            points.append((tip_x, tip_y))

            # Feather Spine line
            self.canvas.create_line(cx, cy, tip_x, tip_y, fill=CYAN_ACCENT, width=1.5, dash=(4, 2))

            # Dense Feather Barb Lines (Visible when zooming)
            for step in [0.3, 0.45, 0.6, 0.75, 0.88]:
                bx = cx + length * step * math.cos(rad)
                by = cy + length * step * math.sin(rad)
                perp = rad + math.pi / 2
                offset = 24 * self.zoom * (1.0 - step * 0.4)
                self.canvas.create_line(bx, by, bx + offset * math.cos(perp), by + offset * math.sin(perp), fill=CYAN_DARK, width=1)
                self.canvas.create_line(bx, by, bx - offset * math.cos(perp), by - offset * math.sin(perp), fill=CYAN_DARK, width=1)

            # Node Dot at Tip
            dot_color = BREACH_RED if i % 4 == 0 else CYAN_BRIGHT
            dot_r = 4.5 * self.zoom
            self.canvas.create_oval(tip_x - dot_r, tip_y - dot_r, tip_x + dot_r, tip_y + dot_r, fill=dot_color, outline="white", width=1)

            platforms = ["GitHub", "X / Twitter", "Telegram", "DeHashed", "Reddit", "Discord", "Keybase", "Pastebin", "BreachDB", "Steam", "Darkweb", "GeoIP", "Bitcoin", "Shodan", "Gravatar", "GitLab"]
            label_text = platforms[i % len(platforms)]
            self.canvas.create_text(tip_x + 10, tip_y - 6, text=label_text, fill=TEXT_COLOR, font=("Courier", int(8 * min(self.zoom, 1.2)), "bold"), anchor="w")

        # 3. Connecting Laser Arcs
        for i in range(len(points)):
            next_idx = (i + 3) % len(points)
            p1 = points[i]
            p2 = points[next_idx]
            arc_color = BREACH_RED if i % 3 == 0 else CYAN_BRIGHT
            self.canvas.create_line(p1[0], p1[1], p2[0], p2[1], fill=arc_color, width=1, dash=(6, 4))

        # 4. BURNING SUN IN THE CENTER OF THE LOTUS
        sun_r = 60 * self.zoom
        # Corona Flares (36 radiating flares like a burning solar star)
        for i in range(36):
            flare_deg = i * 10
            f_rad = math.radians(flare_deg)
            flare_len = (20 + (i % 3) * 18) * self.zoom
            fx1 = cx + (15 * self.zoom) * math.cos(f_rad)
            fy1 = cy + (15 * self.zoom) * math.sin(f_rad)
            fx2 = cx + (15 * self.zoom + flare_len) * math.cos(f_rad)
            fy2 = cy + (15 * self.zoom + flare_len) * math.sin(f_rad)
            self.canvas.create_line(fx1, fy1, fx2, fy2, fill=CYAN_BRIGHT, width=1.5)

        # Solar Corona Glow
        self.canvas.create_oval(cx - sun_r, cy - sun_r, cx + sun_r, cy + sun_r, outline=CYAN_ACCENT, width=2)
        
        # Inner Fusion Ring
        inner_r = 30 * self.zoom
        self.canvas.create_oval(cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r, fill="#082f49", outline=CYAN_BRIGHT, width=2)

        # Blazing White-Hot Solar Core
        core_r = 15 * self.zoom
        self.canvas.create_oval(cx - core_r, cy - core_r, cx + core_r, cy + core_r, fill=SUN_WHITE, outline=CYAN_BRIGHT, width=1)

if __name__ == "__main__":
    root = tk.Tk()
    app = LotusOsintApp(root)
    root.mainloop()
