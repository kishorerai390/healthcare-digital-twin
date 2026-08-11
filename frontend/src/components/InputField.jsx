function InputField({ label, name, type = 'text', value, onChange, placeholder, error, unit, min, max, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          className="w-full border-none bg-transparent text-sm outline-none"
        />
        {unit ? <span className="ml-2 text-sm text-slate-400">{unit}</span> : null}
      </div>
      {error ? <p className="mt-1 text-sm text-rose-500">{error}</p> : null}
    </label>
  );
}

export default InputField;
