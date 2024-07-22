import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  FolderIcon,
  TagIcon,
  LayersIcon,
  ChevronDownIcon,
  XIcon,
} from "lucide-react";

const FilterCategory = ({
  title,
  items,
  selectedItems,
  onSelect,
  icon: Icon,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {items.map((item) => (
        <DropdownMenuCheckboxItem
          key={item}
          checked={selectedItems.includes(item)}
          onCheckedChange={() => onSelect(item)}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span>{item}</span>
          </div>
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const FilterChips = ({ title, selectedItems, onRemove, icon: Icon }) =>
  selectedItems.length > 0 && (
    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span>{title}:</span>
      {selectedItems.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
        >
          {item}
          <button
            type="button"
            className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
            onClick={() => onRemove(item)}
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="h-3.5 w-3.5 fill-white stroke-gray-700/50 group-hover:stroke-gray-700/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>
      ))}
    </div>
  );

const FilterComponent = ({
  consumerGroups,
  topics,
  partitions,
  selectedGroups,
  selectedTopics,
  selectedPartitions,
  setSelectedGroups,
  setSelectedTopics,
  setSelectedPartitions,
  applyFilters,
}) => {
  const handleSelect = (type, item) => {
    switch (type) {
      case "group":
        setSelectedGroups((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
        break;
      case "topic":
        setSelectedTopics((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
        break;
      case "partition":
        setSelectedPartitions((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
        break;
    }
  };

  const handleRemove = (type, item) => {
    switch (type) {
      case "group":
        setSelectedGroups((prev) => prev.filter((i) => i !== item));
        break;
      case "topic":
        setSelectedTopics((prev) => prev.filter((i) => i !== item));
        break;
      case "partition":
        setSelectedPartitions((prev) => prev.filter((i) => i !== item));
        break;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <FilterChips
          title="Consumer Groups"
          selectedItems={selectedGroups}
          onRemove={(item) => handleRemove("group", item)}
          icon={FolderIcon}
        />
        <FilterChips
          title="Topics"
          selectedItems={selectedTopics}
          onRemove={(item) => handleRemove("topic", item)}
          icon={TagIcon}
        />
        <FilterChips
          title="Partitions"
          selectedItems={selectedPartitions}
          onRemove={(item) => handleRemove("partition", item)}
          icon={LayersIcon}
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <FilterCategory
          title="Consumer Groups"
          items={consumerGroups}
          selectedItems={selectedGroups}
          onSelect={(item) => handleSelect("group", item)}
          icon={FolderIcon}
          className="w-1/4"
        />
        <FilterCategory
          title="Topics"
          items={topics}
          selectedItems={selectedTopics}
          onSelect={(item) => handleSelect("topic", item)}
          icon={TagIcon}
          className="w-1/4"
        />
        <FilterCategory
          title="Partitions"
          items={partitions}
          selectedItems={selectedPartitions}
          onSelect={(item) => handleSelect("partition", item)}
          icon={LayersIcon}
          className="w-1/4"
        />
        <Button onClick={applyFilters} className="w-1/4">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterComponent;
