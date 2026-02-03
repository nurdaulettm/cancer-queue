Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")
strProjectPath = "C:\Users\tasmu\Queue_Can"

' Start backend
WScript.Echo "Starting Backend Server..."
objShell.Run "cmd /k cd /d " & strProjectPath & "\backend && python main.py", 1, False

' Wait a moment
WScript.Sleep(3000)

' Start frontend
WScript.Echo "Starting Frontend Server..."
objShell.Run "cmd /k cd /d " & strProjectPath & "\frontend && C:\tools\nodejs\node-v18.19.0-win-x64\npm.cmd run dev", 1, False

' Wait for services to start
WScript.Sleep(5000)

' Open browser
WScript.Echo "Opening Dashboard..."
objShell.Run "http://localhost:3000", 1, False

WScript.Echo "Services started! Access your dashboard at http://localhost:3000"
