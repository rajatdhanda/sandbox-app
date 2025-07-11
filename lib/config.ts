// lib/config.ts

export interface ConfigField {
  id: number;
  label: string;
  type: string;
  category: string;
}

// Dummy fields for now; replace with Supabase logic later
export async function getConfigFields(category: string): Promise<ConfigField[]> {
  return [
    { id: 1, label: 'Option A', type: 'text', category },
    { id: 2, label: 'Option B', type: 'checkbox', category }
  ];
}
