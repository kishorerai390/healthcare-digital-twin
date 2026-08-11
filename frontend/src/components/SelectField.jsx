function SelectField({ label, name, value, onChange, options, error, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm text-rose-500">{error}</p> : null}
    </label>
  );
}

export default SelectField;
