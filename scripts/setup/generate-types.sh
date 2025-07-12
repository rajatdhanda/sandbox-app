#!/bin/bash

# Ensure you've run `supabase login` and `supabase link` first
PROJECT_REF="eldgobpkssjngjabkoyz"

npx supabase gen types typescript --project-id $PROJECT_REF > lib/supabase/generated-types.ts
