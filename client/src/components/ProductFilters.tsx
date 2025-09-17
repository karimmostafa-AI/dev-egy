import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

// Mock data, in a real app this would come from the API based on the product list
const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { id: 'tops', name: 'Scrub Tops', count: 185 },
      { id: 'pants', name: 'Scrub Pants', count: 140 },
      { id: 'sets', name: 'Scrub Sets', count: 65 },
      { id: 'jackets', name: 'Jackets & Lab Coats', count: 95 },
    ]
  },
  {
    id: 'brand',
    name: 'Brand',
    options: [
      { id: 'cherokee', name: 'Cherokee', count: 1 },
      { id: 'barco', name: 'Barco', count: 1 },
      { id: 'wonderwink', name: 'WonderWink', count: 1 },
      { id: 'healing-hands', name: 'Healing Hands', count: 1 },
    ]
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { id: 'black', name: 'Black', count: 320 },
      { id: 'white', name: 'White', count: 195 },
      { id: 'red', name: 'Red', count: 85 },
      { id: 'navy', name: 'Navy', count: 240 },
    ]
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { id: 'xs', name: 'XS', count: 150 },
      { id: 's', name: 'S', count: 280 },
      { id: 'm', name: 'M', count: 320 },
    ]
  },
];

interface ProductFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (groupId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const groupFilters = prev[groupId] || [];
      const newGroupFilters = groupFilters.includes(optionId)
        ? groupFilters.filter(id => id !== optionId)
        : [...groupFilters, optionId];
      
      const newFilters = { ...prev, [groupId]: newGroupFilters };
      if (newGroupFilters.length === 0) {
        delete newFilters[groupId];
      }
      
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange?.({});
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  return (
    <div className="w-full p-4 bg-card border rounded-lg" data-testid="product-filters">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <Button 
            variant="link"
            className="text-sm p-0 h-auto" 
            onClick={clearAllFilters}
            data-testid="clear-filters"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['category', 'brand']} className="w-full">
        {filterGroups.map((group) => (
          <AccordionItem value={group.id} key={group.id}>
            <AccordionTrigger className="font-semibold text-sm">
              {group.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.id}-${option.id}`}
                      checked={selectedFilters[group.id]?.includes(option.id) || false}
                      onCheckedChange={() => toggleFilter(group.id, option.id)}
                      data-testid={`filter-${group.id}-${option.id}`}
                    />
                    <label
                      htmlFor={`${group.id}-${option.id}`}
                      className="text-sm cursor-pointer flex-1 flex justify-between items-center"
                    >
                      <span>{option.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                        {option.count}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
