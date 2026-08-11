function CheckboxGroup({ title, options, selectedValues, onChange, error }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selectedValues.includes(option);
          return (
            <label key={option} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(option)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-1 text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

export default CheckboxGroup;
