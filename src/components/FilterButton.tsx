import type { FilterType } from "../types";

interface FilterButtonProps {
  filter: FilterType | string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  type?: "primary" | "subcategory";
}

export function FilterButton({
  filter,
  isActive,
  onClick,
  children,
  type = "primary",
}: FilterButtonProps) {
  const getFilterColors = () => {
    if (filter === "all")
      return "border-blue-400/30 text-blue-400 hover:border-blue-400 hover:text-blue-400";
    if (filter === "positive")
      return "border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:text-emerald-500";
    if (filter === "negative")
      return "border-amber-500/30 text-amber-400 hover:border-amber-500 hover:text-amber-500";
    if (filter === "neutral")
      return "border-neutral-500/30 text-neutral-400 hover:border-neutral-500 hover:text-neutral-500";
    return "border-neutral-800 text-neutral-400 hover:border-blue-400 hover:text-blue-400";
  };

  const getActiveColors = () => {
    if (filter === "all")
      return "bg-neutral-800 text-blue-400 border-blue-400 font-bold shadow-md shadow-blue-400/30";
    if (filter === "positive")
      return "bg-neutral-800 text-emerald-500 border-emerald-500 font-bold shadow-md shadow-emerald-500/30";
    if (filter === "negative")
      return "bg-neutral-800 text-amber-500 border-amber-500 font-bold shadow-md shadow-amber-500/30";
    if (filter === "neutral")
      return "bg-neutral-800 text-neutral-500 border-neutral-500 font-bold shadow-md shadow-neutral-500/30";
    return "bg-neutral-800 text-blue-400 border-blue-400 font-bold shadow-md shadow-blue-400/30";
  };

  const getButtonSize = () => {
    if (type === "subcategory") {
      return "px-3 lg:px-4 py-1 text-sm";
    }
    return "px-4 py-1 text-sm";
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getButtonSize()} border-2 rounded-2xl font-medium whitespace-nowrap h-8 flex items-center
        transition-all duration-300 cursor-pointer bg-neutral-900
        ${isActive ? getActiveColors() : getFilterColors()}
      `}
    >
      {children}
    </button>
  );
}
