#!/usr/bin/env bash
# My Tutor Flow — Agent API startup
# Run this once to set up, then use: uvicorn main:app --reload --port 8000

set -e

if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

source .venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
  cp .env.template .env
  echo ""
  echo "Created .env from template."
  echo "Add your ANTHROPIC_API_KEY to .env before starting the server."
  exit 1
fi

echo ""
echo "Starting My Tutor Flow Agent API on http://localhost:8000"
uvicorn main:app --reload --port 8000
