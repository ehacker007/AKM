#!/usr/bin/env bash
# LOTUS OSINT Launcher for Linux Terminals

echo "=========================================================="
echo "      ⚡ LOTUS OSINT - JARVIS LINUX TERMINAL LAUNCHER ⚡  "
echo "=========================================================="

# Check if Python3 is available
if command -v python3 &>/dev/null; then
    echo "[+] Found Python3. Checking for Tkinter..."
    python3 -c "import tkinter" &>/dev/null
    if [ $? -eq 0 ]; then
        echo "[+] Tkinter is installed! Launching Native Lotus OSINT GUI..."
        python3 lotus_osint_gui.py
        exit 0
    else
        echo "[!] Tkinter not installed. You can install it with:"
        echo "    sudo apt install -y python3-tk"
        echo "[*] Falling back to Node.js CLI launcher..."
    fi
fi

# Fallback to Node.js
if command -v node &>/dev/null; then
    echo "[+] Running Node.js Lotus OSINT CLI..."
    node lotus_osint_node.js "${1:-tonystark}"
else
    echo "[-] Neither Python3 nor Node.js detected. Please install python3-tk or nodejs."
fi
