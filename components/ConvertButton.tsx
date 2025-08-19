interface ConvertButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ConvertButton({ onClick, isLoading }: ConvertButtonProps) {
  return (
    <button
      type="button"
      className="px-8 py-3 font-semibold rounded-md text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? "Refactoring..." : "Convert to Tailwind CSS"}
    </button>
  );
}