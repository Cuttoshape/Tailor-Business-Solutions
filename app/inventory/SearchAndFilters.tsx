interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 mb-4">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials, suppliers..."
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
            aria-label="Search"
          >
            <i className="ri-search-line text-gray-400 text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
