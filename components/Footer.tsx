export function Footer() {
  return (
    <footer className="p-6 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm">
      <p>
        Built by Saif Rahman, a freelance front-end developer
        specializing in high-performance Next.js applications.
      </p>
      <p>
        Need a beautiful, robust landing page or website?{" "}
        <a
          href="https://linktr.ee/metalsaif" // Remember to use your actual URL
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-500 dark:text-emerald-400 hover:underline"
        >
          Let's talk.
        </a>
      </p>
    </footer>
  );
}