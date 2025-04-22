@echo off
REM Local development script for Windows

REM Set environment variables
set NODE_ENV=development

REM Run with local configuration
npx tsx server/index-local.ts