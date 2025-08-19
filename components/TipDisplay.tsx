// components/TipDisplay.tsx
interface TipDisplayProps {
  tip: string;
}

export function TipDisplay({ tip }: TipDisplayProps) {
  if (!tip) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-sky-900 border border-blue-200 dark:border-sky-800 rounded-lg">
      <div className="flex items-start gap-3">
        {/* Lightbulb Icon */}
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75H2.75a.75.75 0 010-1.5H4.25A.75.75 0 015 10zM14.596 6.464a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06zM5.404 15.657a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-sky-300">Pro Tip:</p>
          <p className="mt-1 text-sm text-blue-700 dark:text-sky-400">{tip}</p>
        </div>
      </div>
    </div>
  );
}