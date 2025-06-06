interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search terms...",
}: SearchBoxProps) {
  return (
    <div className="w-full max-w-md relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-8 pl-9 pr-5 bg-neutral-800 border-2 border-neutral-700 rounded-2xl text-neutral-200 text-sm transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
          autoComplete="off"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
  );
}
