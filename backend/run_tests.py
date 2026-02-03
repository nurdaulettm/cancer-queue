"""
Combined Server Start and Test Runner
"""
import subprocess
import sys
import time
import os
import threading

os.chdir(r"C:\Users\tasmu\Queue_Can\backend")

def read_server_output(proc):
    """Read server output in a thread"""
    for line in proc.stdout:
        print(f"[SERVER] {line}", end="")

# Start server in background
print("Starting FastAPI server...")
server = subprocess.Popen(
    [sys.executable, "main.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

# Start thread to read server output
output_thread = threading.Thread(target=read_server_output, args=(server,), daemon=True)
output_thread.start()

# Wait for server to start
print("Waiting for server to initialize...")
time.sleep(5)

# Check if server started
if server.poll() is not None:
    print("Server failed to start!")
    sys.exit(1)

print("Server is running, starting tests...")

# Run tests
try:
    result = subprocess.run(
        [sys.executable, "qa_users_test.py"],
        cwd=r"C:\Users\tasmu\Queue_Can\backend"
    )
except KeyboardInterrupt:
    pass
finally:
    print("\nStopping server...")
    server.terminate()
    server.wait()
    print("Done!")
