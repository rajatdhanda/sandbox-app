#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "Running Sandbox API health checks..."
echo "------------------------------------"

function check() {
  local endpoint=$1
  local label=$2
  local url="$API_BASE/$endpoint"

  status=$(curl -s -o /dev/null -w "%{http_code}" $url)

  if [ "$status" == "200" ]; then
    echo "✅ $label ($endpoint) - $status"
  elif [ "$status" == "404" ]; then
    echo "❌ $label ($endpoint) - Not Found (404)"
  else
    echo "⚠️  $label ($endpoint) - Status $status"
  fi
}

check test-health "Basic Health"
check test-db "Database Connection"
check test-admin-data "Admin Data"
check test-auth "Auth (skip if no token)"
check test-cache "Cache"

echo "✅ Done testing!"
