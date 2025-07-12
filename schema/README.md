# Schema Management

## Quick Commands
```bash
# Generate everything
./scripts/schema/generate-all.sh

# Individual steps  
npx tsx schema/index.ts
npx tsx schema/copy-to-edits.mts
npx tsx schema/generators/generate-clients-from-edits.mts
```

## File Organization
- `core/` - Schema fetching and sync
- `generators/` - Code generation scripts  
- `config/` - Raw database schema
- `migration/` - Migration tools
