#!/bin/bash
echo "🚀 Running complete schema generation pipeline..."

echo "⚡ Step 1: Fetch schema from database"
npx tsx schema/index.ts

echo "⚡ Step 2: Copy to edits format"  
npx tsx schema/copy-to-edits.mts

echo "⚡ Step 3: Generate types"
npx tsx schema/generators/generate-types-from-edits.mts

echo "⚡ Step 4: Generate clients"
npx tsx schema/generators/generate-clients-from-edits.mts

echo "⚡ Step 5: Generate queries"
npx tsx schema/generators/generate-queries-from-edits.mts

echo "⚡ Step 6: Generate index"
npx tsx schema/generators/generate-index-from-edits.mts

echo "✅ Schema generation complete!"
