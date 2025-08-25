interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
}

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string; // Use '?' to make it an optional prop
}


export function InputArea({ value, onChange, placeholder }: InputAreaProps) {
  return (
    // The main div can be simplified for this new layout
    <div className="flex-grow">
      {/* We don't need the <label> anymore for this design */}
      <input
        type="url"
        className="w-full p-3 font-sans text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-slate-300 transition-colors"
        // MODIFICATION 2: Pass the placeholder prop to the input element
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}