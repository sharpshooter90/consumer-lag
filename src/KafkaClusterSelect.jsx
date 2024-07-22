// components/KafkaClusterSelect.jsx
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

const KafkaClusterSelect = ({ clusters, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClusters, setFilteredClusters] = useState(clusters);

  useEffect(() => {
    const filtered = clusters.filter((cluster) =>
      cluster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClusters(filtered);
  }, [searchTerm, clusters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <div className="flex items-center justify-between">
            <SelectValue placeholder="Select a Kafka cluster" />
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-full max-h-60 overflow-auto">
          <div className="sticky top-0 z-10 bg-background px-4 py-2">
            <Input
              type="search"
              placeholder="Search clusters..."
              className="w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <SelectGroup>
            {filteredClusters.map((cluster) => (
              <SelectItem key={cluster.id} value={cluster.id}>
                {cluster.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default KafkaClusterSelect;
