import { Search } from "lucide-react";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#050517]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-12 py-3 rounded-full focus:outline-none bg-[#E5E5E5] placeholder:text-[#050517] placeholder:font-medium"
      />

    </div>
  );
}

