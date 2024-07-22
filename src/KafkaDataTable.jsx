import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const KafkaDataTable = ({ chartData, onRowHover, onRowLeave, onItemClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleRowClick = (item) => {
    const key = `${item.group}-${item.topic}-${item.partition}`;
    onItemClick(key);
  };

  const flattenedData = useMemo(() => {
    if (!chartData.length) return [];
    return chartData.flatMap((point) =>
      Object.entries(point)
        .filter(([key]) => key !== "time")
        .map(([key, value]) => {
          const [group, topic, partition] = key.split("-");
          return {
            time: point.time,
            group,
            topic,
            partition,
            lag: value,
            lagPercentage: ((value / 3) * 100).toFixed(2) + "%",
            status: value > 2.25 ? "High" : value > 1.5 ? "Medium" : "Low",
          };
        })
    );
  }, [chartData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({ status: null });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSortClick = (column) => {
    setSortBy(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const filteredData = useMemo(() => {
    let data = flattenedData;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.group.toLowerCase().includes(lowerQuery) ||
          item.topic.toLowerCase().includes(lowerQuery) ||
          item.partition.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.status) {
      data = data.filter((item) => item.status === filters.status);
    }

    if (sortBy) {
      data = data.sort((a, b) => {
        const valueA = sortBy === "lag" ? parseFloat(a[sortBy]) : a[sortBy];
        const valueB = sortBy === "lag" ? parseFloat(b[sortBy]) : b[sortBy];

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [flattenedData, searchQuery, sortBy, sortOrder, filters]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumer Lag Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Select
            value={filters.status || ""}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableCaption>
            Consumer lag data for Kafka topics and partitions.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Partition</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("lag")}
              >
                Lag {sortBy === "lag" && (sortOrder === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead>Lag %</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <TableRow
                    onMouseEnter={() =>
                      onRowHover(
                        `${item.group}-${item.topic}-${item.partition}`
                      )
                    }
                    onMouseLeave={onRowLeave}
                    className="cursor-pointer"
                  >
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.group}</TableCell>
                    <TableCell>{item.topic}</TableCell>
                    <TableCell>{item.partition}</TableCell>
                    <TableCell>{item.lag}</TableCell>
                    <TableCell>{item.lagPercentage}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === "High"
                            ? "bg-red-100 text-red-800"
                            : item.status === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Details</h4>
                      <p className="text-sm text-muted-foreground">
                        View more details or open in drawer
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Button onClick={() => handleRowClick(item)}>
                        Open in Drawer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {pageCount}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KafkaDataTable;
