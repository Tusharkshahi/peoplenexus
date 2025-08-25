#!/usr/bin/env python3
"""
Startup script for PeopleNexus AI Resume Services
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import openai
        import pydantic
        print("✅ All required dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Warning: .env file not found")
        print("Please copy env.example to .env and configure your Azure OpenAI settings")
        return False
    
    # Check for required environment variables
    required_vars = [
        "AZURE_OPENAI_API_KEY",
        "AZURE_OPENAI_ENDPOINT", 
        "AZURE_OPENAI_DEPLOYMENT_NAME"
    ]
    
    missing_vars = []
    with open(env_file, 'r') as f:
        content = f.read()
        for var in required_vars:
            if f"{var}=" not in content or f"{var}=your_" in content:
                missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Warning: Missing or unconfigured environment variables: {', '.join(missing_vars)}")
        print("Please update your .env file with your Azure OpenAI credentials")
        return False
    
    print("✅ Environment variables configured")
    return True

def start_server():
    """Start the FastAPI server"""
    print("\n🚀 Starting PeopleNexus AI Resume Services...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔴 Press Ctrl+C to stop the server\n")
    
    try:
        # Start the server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("=" * 60)
    print("🎯 PeopleNexus AI Resume Services")
    print("=" * 60)
    
    # Run checks
    checks_passed = True
    
    if not check_python_version():
        checks_passed = False
    
    if not check_dependencies():
        checks_passed = False
    
    # Environment check is optional (warning only)
    check_env_file()
    
    if not checks_passed:
        print("\n❌ Setup checks failed. Please fix the issues above and try again.")
        sys.exit(1)
    
    print("\n✅ All checks passed!")
    start_server()

if __name__ == "__main__":
    main()
