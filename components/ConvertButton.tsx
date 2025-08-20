// components/ConvertButton.tsx

// MODIFICATION: Define a type for the component's props
interface ConvertButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingMessage: string;
}

// MODIFICATION: Apply the type to the props
export const ConvertButton = ({ onClick, isLoading, loadingMessage }: ConvertButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-8 py-3 font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-400 transition-colors min-w-[270px]"
    >
      {isLoading ? loadingMessage : "Convert to Tailwind CSS"}
    </button>
  );
};