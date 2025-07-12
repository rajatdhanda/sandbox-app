#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# API paths to test
declare -a paths=(
  "test-health"
  "test-db"
  "test-admin-data"
  "test-auth"     # requires token, handled below
  "test-cache"
)

# Dummy token for test-auth (replace with real one if available)
AUTH_TOKEN="Bearer YOUR_TEST_JWT"

echo "Running Sandbox API health checks..."
echo "------------------------------------"

for path in "${paths[@]}"
do
  echo -n "➡️  Testing /$path... "

  if [ "$path" == "test-auth" ]; then
    # Skip if no token provided
    if [[ "$AUTH_TOKEN" == *"YOUR_TEST_JWT"* ]]; then
      echo "⚠️ Skipped (no token)"
      continue
    fi
    curl -s -o /dev/null -w "%{http_code}" -H "Authorization: $AUTH_TOKEN" "$BASE_URL/$path"
  else
    curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$path"
  fi

  echo ""
done

echo "✅ Done testing!"