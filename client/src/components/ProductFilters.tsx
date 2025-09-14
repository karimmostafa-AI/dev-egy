import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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

const filterGroups: FilterGroup[] = [
  {
    id: 'sale',
    name: 'Sale',
    options: [
      { id: 'limited-time', name: 'Limited Time Sale', count: 45 },
      { id: 'clearance', name: 'Clearance', count: 128 },
      { id: 'all-sale', name: 'All Sale', count: 180 }
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
      { id: 'blue', name: 'Blue', count: 180 }
    ]
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { id: 'xs', name: 'XS', count: 150 },
      { id: 's', name: 'S', count: 280 },
      { id: 'm', name: 'M', count: 320 },
      { id: 'l', name: 'L', count: 275 },
      { id: 'xl', name: 'XL', count: 225 }
    ]
  },
  {
    id: 'brand',
    name: 'Brand',
    options: [
      { id: 'seen', name: 'Seen', count: 95 },
      { id: 'hleo', name: 'Hleo', count: 78 },
      { id: 'omaima', name: 'Omaima', count: 120 },
      { id: 'cairo-medical', name: 'Cairo Medical', count: 65 },
      { id: 'alexandria', name: 'Alexandria', count: 42 }
    ]
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { id: 'tops', name: 'Scrub Tops', count: 185 },
      { id: 'pants', name: 'Scrub Pants', count: 140 },
      { id: 'sets', name: 'Scrub Sets', count: 65 },
      { id: 'jackets', name: 'Jackets & Lab Coats', count: 95 },
      { id: 'accessories', name: 'Accessories', count: 215 }
    ]
  }
];

const sortOptions = [
  { id: 'best-match', name: 'Best Match' },
  { id: 'trending', name: 'Trending Now' },
  { id: 'price-low', name: 'Price Low to High' },
  { id: 'price-high', name: 'Price High to Low' },
  { id: 'newest', name: 'Newest First' },
  { id: 'rating', name: 'Customer Rating' }
];

interface ProductFiltersProps {
  itemCount: number;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onSortChange?: (sort: string) => void;
}

export default function ProductFilters({ itemCount, onFilterChange, onSortChange }: ProductFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['sale', 'color']);
  const [sortBy, setSortBy] = useState('best-match');

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

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

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  return (
    <div className="w-full" data-testid="product-filters">
      {/* Header with item count and sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {itemCount.toLocaleString()} Items
          </h2>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="px-3">
              {getActiveFilterCount()} filters applied
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48" data-testid="sort-select">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
            data-testid="clear-filters"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {filterGroups.map((group) => (
          <Card key={group.id} className="p-4">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full mb-3 hover:text-primary transition-colors"
              data-testid={`filter-group-${group.id}`}
            >
              <h3 className="font-semibold text-sm">{group.name}</h3>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${
                  expandedGroups.includes(group.id) ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {expandedGroups.includes(group.id) && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                      className="text-sm cursor-pointer flex-1 flex justify-between"
                    >
                      <span>{option.name}</span>
                      <span className="text-muted-foreground">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mt-4">
        <Button variant="outline" className="w-full" data-testid="mobile-filter-toggle">
          <Filter className="h-4 w-4 mr-2" />
          Filter & Sort ({getActiveFilterCount()})
        </Button>
      </div>
    </div>
  );
}