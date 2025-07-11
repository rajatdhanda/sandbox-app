import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFieldOptions } from '@/hooks/useConfigFields';
import { ChevronDown } from 'lucide-react-native';

interface DynamicSelectProps {
  category: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleChange?: (values: string[]) => void;
  style?: any;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  category,
  value,
  onValueChange,
  placeholder = 'Select an option',
  multiple = false,
  selectedValues = [],
  onMultipleChange,
  style
}) => {
  const { options, loading, error } = useFieldOptions(category);
  const [isOpen, setIsOpen] = React.useState(false);

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.loadingText}>Loading options...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>Error loading options</Text>
      </View>
    );
  }

  const handleSingleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const handleMultipleSelect = (optionValue: string) => {
    if (!onMultipleChange) return;
    
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    
    onMultipleChange(newValues);
  };

  const getDisplayText = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option?.label || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    } else {
      if (!value) return placeholder;
      const option = options.find(opt => opt.value === value);
      return option?.label || value;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.selectorText, !value && !selectedValues.length && styles.placeholderText]}>
          {getDisplayText()}
        </Text>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.optionsList} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  (multiple ? selectedValues.includes(option.value) : value === option.value) && styles.selectedOption
                ]}
                onPress={() => multiple ? handleMultipleSelect(option.value) : handleSingleSelect(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  (multiple ? selectedValues.includes(option.value) : value === option.value) && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectorText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  placeholderText: {
    color: '#6B7280',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  optionsList: {
    maxHeight: 200,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    paddingVertical: 12,
  },
});