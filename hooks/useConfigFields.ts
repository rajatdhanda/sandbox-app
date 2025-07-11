import { useState, useEffect } from 'react';
import { getConfigFields, ConfigField } from '../lib/config';

export const useConfigFields = (category: string) => {
  const [fields, setFields] = useState<ConfigField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const data = await getConfigFields(category);
        setFields(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch config fields');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [category]);

  return { fields, loading, error, refetch: () => fetchFields() };
};

// Helper hook for getting field options as simple arrays
export const useFieldOptions = (category: string) => {
  const { fields, loading, error } = useConfigFields(category);
  
  const options = fields.map(field => ({
    label: field.label,
    value: field.value
  }));

  return { options, loading, error };
};