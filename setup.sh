#!/usr/bin/env bash
set -e

echo "=== Tungsten AI Positioning — Setup ==="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1 || { echo "❌ Python 3 is required. Install from https://python.org"; exit 1; }

# Install dependencies
echo "→ Installing Node dependencies..."
npm install

echo "→ Installing Python dependencies..."
pip install -r requirements.txt 2>/dev/null || pip3 install -r requirements.txt

# Set up env file if missing
if [ ! -f .env.local ]; then
  if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > .env.local
    echo "→ Created .env.local from environment variable"
  else
    echo ""
    echo "⚠️  No ANTHROPIC_API_KEY found."
    echo "   Get one from https://console.anthropic.com/settings/keys"
    echo ""
    read -p "   Paste your API key (or press Enter to skip): " key
    if [ -n "$key" ]; then
      echo "ANTHROPIC_API_KEY=$key" > .env.local
      echo "→ Created .env.local"
    else
      cp .env.local.example .env.local
      echo "→ Created .env.local from example (you'll need to edit it)"
    fi
  fi
fi

echo ""
echo "✅ Setup complete! Starting the app..."
echo "   Opening http://localhost:3002"
echo ""

# Open browser (works on macOS, Linux, WSL)
(sleep 3 && (open http://localhost:3002 2>/dev/null || xdg-open http://localhost:3002 2>/dev/null || start http://localhost:3002 2>/dev/null || true)) &

npm run dev
