# Quick Start Guide - Fix PowerShell Execution Policy

## Problem
If you see this error:
```
.\start-app.ps1 : File cannot be loaded because running scripts is disabled on this system.
```

This is because PowerShell's execution policy prevents scripts from running.

## Solution Options

### Option 1: Bypass for Current Session (Recommended - No Admin Required)

Run this command first, then run the script:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\start-app.ps1
```

Or run the script with bypass:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-app.ps1
```

### Option 2: Change Execution Policy for Current User (Permanent)

Run PowerShell as Administrator, then:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can run scripts normally:
```powershell
.\start-app.ps1
```

### Option 3: Use Manual Commands (No Scripts Needed)

If you prefer not to change execution policy, use these commands:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Recommended: One-Time Setup

Run this once (as Administrator if needed):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This allows you to run local scripts while still protecting against downloaded scripts.

## Verify Execution Policy

Check current policy:
```powershell
Get-ExecutionPolicy
```

Expected output: `RemoteSigned` or `Bypass`
