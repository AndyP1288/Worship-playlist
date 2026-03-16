export default function SearchBar({ value, onChange, placeholder = 'Search songs...' }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2"
    />
  );
}
