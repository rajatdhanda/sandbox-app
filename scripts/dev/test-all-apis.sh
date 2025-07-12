#!/bin/bash
echo "🧪 Testing all APIs..."

BASE_URL="http://localhost:3000"

echo "🔍 Testing production APIs..."
curl -s "$BASE_URL/api/hello"

echo "🔍 Testing generated clients..."
curl -s "$BASE_URL/api/_dev/test-generated-clients-final"

echo "🔍 Testing debug APIs..."
curl -s "$BASE_URL/api/_dev/debug-migration"

echo "✅ API testing complete!"
