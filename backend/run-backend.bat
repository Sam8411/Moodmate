@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo  MOODMATE AI - BACKEND AUTOMATIC MAVEN RUNNER
echo =======================================================

:: Check if java is available
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH. Please install JDK 21+ and retry.
    pause
    exit /b 1
)

:: Check if maven is available on the system
where mvn >nul 2>nul
if %errorlevel% eq 0 (
    echo [INFO] System Maven found. Launching application...
    mvn clean spring-boot:run
    exit /b 0
)

echo [INFO] System Maven not found. Checking for portable Maven...
set PORTABLE_MVN_DIR=%~dp0maven_portable
set PORTABLE_MVN_BIN=%PORTABLE_MVN_DIR%\apache-maven-3.9.6\bin\mvn.cmd

if exist "%PORTABLE_MVN_BIN%" (
    echo [INFO] Portable Maven found. Launching application...
    call "%PORTABLE_MVN_BIN%" clean spring-boot:run
    exit /b 0
)

echo [INFO] Portable Maven not found. Downloading Maven 3.9.6 via PowerShell...
mkdir "%PORTABLE_MVN_DIR%" 2>nul
set ZIP_PATH=%PORTABLE_MVN_DIR%\maven.zip

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%ZIP_PATH%'"

if %errorlevel% neq 0 (
    echo [ERROR] Failed to download Maven. Please connect to the internet or install Maven manually.
    pause
    exit /b 1
)

echo [INFO] Extracting Maven zip...
powershell -Command "Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%PORTABLE_MVN_DIR%'"
del "%ZIP_PATH%"

if exist "%PORTABLE_MVN_BIN%" (
    echo [INFO] Portable Maven installed successfully. Launching application...
    call "%PORTABLE_MVN_BIN%" clean spring-boot:run
) else (
    echo [ERROR] Extraction failed or path is invalid. Please install Maven manually.
    pause
    exit /b 1
)
