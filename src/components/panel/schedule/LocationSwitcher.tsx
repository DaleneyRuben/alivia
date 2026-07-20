export interface LocationSwitcherProps {
  locations: { id: string; name: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function LocationSwitcher({
  locations,
  activeId,
  onSelect,
}: LocationSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {locations.map((location) => {
        const active = location.id === activeId;
        return (
          <button
            key={location.id}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(location.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold ${
              active
                ? "bg-ink text-white"
                : "border border-input-border bg-white text-ink"
            }`}
          >
            {location.name}
          </button>
        );
      })}
    </div>
  );
}
