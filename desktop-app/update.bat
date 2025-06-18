@echo off
REM update.bat [PR_NUMBER]
setlocal enabledelayedexpansion

cd /d "%~dp0"

for /f "tokens=*" %%a in ('git status --porcelain') do set CHANGES=1
if defined CHANGES (
  echo [update] Stashing local changes…
  git stash push -m "pre-update-%date%-%time%" >nul
)

if "%1"=="" (
  echo [update] Pulling origin/main…
  git checkout main >nul 2>&1 || git checkout -B main
  git pull origin main --ff-only
) else (
  set PR=%1
  echo [update] Fetching PR !PR!…
  git fetch origin pull/!PR!/head:pr-!PR! --force
  git checkout pr-!PR!
)

if exist npm-offline.tgz (
  tar -xf npm-offline.tgz
)
npm ci --offline || npm ci

if defined CHANGES (
  echo [update] Restoring previous changes…
  git stash pop --index >nul || echo [update] Nothing to pop.
)

for /f "tokens=*" %%c in ('git rev-parse --short HEAD') do set REV=%%c
for /f "tokens=1-3" %%d in ("%date%") do set TODAY=%%d %%e %%f

echo [update] Now on revision !REV! (!TODAY!).
endlocal
