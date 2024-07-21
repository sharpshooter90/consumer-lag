import React, { useState, useMemo } from "react";

const KafkaDataTable = ({ chartData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
            lagPercentage: ((value / 3) * 100).toFixed(2) + "%", // Changed from 1000 to 3
            status: value > 2.25 ? "High" : value > 1.5 ? "Medium" : "Low", // Adjusted thresholds
          };
        }),
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

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
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
          item.partition.toLowerCase().includes(lowerQuery),
      );
    }

    if (filters.status) {
      data = data.filter((item) => item.status === filters.status);
    }

    if (sortBy) {
      data = data.sort((a, b) => {
        const valueA = sortBy === "lag" ? parseInt(a[sortBy], 10) : a[sortBy];
        const valueB = sortBy === "lag" ? parseInt(b[sortBy], 10) : b[sortBy];

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
    currentPage * itemsPerPage,
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Consumer Lag Data Table</h3>
      <div className="flex gap-4 items-center">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 px-3 py-2 border rounded-md"
        />

        {/* Filters */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Status:
          </label>
          <select
            id="statusFilter"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          Showing page {currentPage} of {pageCount}
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div style={{ height: "300px", overflowY: "auto" }}>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="sticky top-0 px-4 py-2">Time</th>
                <th className="sticky top-0 px-4 py-2">Group</th>
                <th className="sticky top-0 px-4 py-2">Topic</th>
                <th className="sticky top-0 px-4 py-2">Partition</th>
                <th
                  className="sticky top-0 px-4 py-2 cursor-pointer"
                  onClick={() => handleSortClick("lag")}
                >
                  Lag {sortBy === "lag" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="sticky top-0 px-4 py-2">Lag %</th>
                <th className="sticky top-0 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">{item.time}</td>
                  <td className="border px-4 py-2">{item.group}</td>
                  <td className="border px-4 py-2">{item.topic}</td>
                  <td className="border px-4 py-2">{item.partition}</td>
                  <td className="border px-4 py-2">{item.lag}</td>
                  <td className="border px-4 py-2">{item.lagPercentage}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === "High"
                          ? "bg-red-500 text-white"
                          : item.status === "Medium"
                            ? "bg-yellow-500 text-black"
                            : "bg-green-500 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KafkaDataTable;
