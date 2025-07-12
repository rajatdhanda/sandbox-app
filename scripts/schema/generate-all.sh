#!/bin/bash
echo "🚀 Running complete schema generation pipeline with dynamic relationships..."

echo "⚡ Step 1: Fetch schema from database"
npx tsx schema/index.ts

echo "⚡ Step 2: Copy to edits format"  
npx tsx schema/copy-to-edits.mts

echo "⚡ Step 3: Detect relationships dynamically"
npx tsx schema/generators/detect-relationships.mts

echo "⚡ Step 4: Generate types with relationships"
npx tsx schema/generators/generate-types-from-edits.mts

echo "⚡ Step 5: Generate clients"
npx tsx schema/generators/generate-clients-from-edits.mts

echo "⚡ Step 6: Generate queries"
npx tsx schema/generators/generate-queries-from-edits.mts

echo "⚡ Step 7: Generate index"
npx tsx schema/generators/generate-index-from-edits.mts

echo "✅ Dynamic schema generation complete!"
echo ""
echo "🎯 Generated:"
echo "  - Base types for all tables"
echo "  - Relationship types (WithRelations)"
echo "  - Query helpers with relationship support"
echo "  - Dynamic clients and queries"