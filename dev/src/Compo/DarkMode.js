// 'use client';

// import { useEffect, useState } from 'react';

// export default function DarkModeToggle() {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     // On initial load, apply theme from localStorage or default
//     const storedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//     if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
//       document.documentElement.classList.add('dark');
//       setDarkMode(true);
//     } else {
//       document.documentElement.classList.remove('dark');
//       setDarkMode(false);
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);

//     if (newMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   return (
//     <button
//       onClick={toggleDarkMode}
//       className="fixed top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//       aria-label="Toggle Dark Mode"
//     >
//       {darkMode ? '🌙' : '☀️'}
//     </button>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';

// export default function DarkModeToggle() {
//   const [enabled, setEnabled] = useState(false);

//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//     if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
//       document.documentElement.classList.add('dark');
//       setEnabled(true);
//     } else {
//       document.documentElement.classList.remove('dark');
//       setEnabled(false);
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newValue = !enabled;
//     setEnabled(newValue);
//     document.documentElement.classList.toggle('dark', newValue);
//     localStorage.setItem('theme', newValue ? 'dark' : 'light');
//   };

//   return (
//     <div className="fixed top-4 right-4 z-50">
//       <button
//         onClick={toggleDarkMode}
//         className={`w-14 h-8 flex items-center justify-between rounded-full px-1 transition-colors duration-300
//           ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
//         aria-label="Toggle Dark Mode"
//       >
//         {/* Sun Icon */}
//         <svg
//           className={`w-5 h-5 text-yellow-400 transition-opacity duration-300 ${
//             enabled ? 'opacity-0' : 'opacity-100'
//           }`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M10 15a5 5 0 100-10 5 5 0 000 10zm0 4a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm0-16a1 1 0 01-1-1V1a1 1 0 112 0v1a1 1 0 01-1 1zm7 9a1 1 0 01-1-1h1a1 1 0 110 2h-1a1 1 0 011-1zM3 10a1 1 0 011-1H3a1 1 0 100 2h1a1 1 0 01-1-1zm11.071 5.071a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM6.343 5.757a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707zm9.9-2.121a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM5.757 13.657a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707z" />
//         </svg>

//         {/* Moon Icon */}
//         <svg
//           className={`w-5 h-5 text-white transition-opacity duration-300 ${
//             enabled ? 'opacity-100' : 'opacity-0'
//           }`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path
//             fillRule="evenodd"
//             d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { Sun, Moon } from 'lucide-react';

// export default function DarkModeToggle() {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const theme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//     const dark = theme === 'dark' || (theme === null && prefersDark);
//     setIsDark(dark);
//     document.documentElement.classList.toggle('dark', dark);
//   }, []);

//   const toggleTheme = () => {
//     const newDark = !isDark;
//     setIsDark(newDark);
//     localStorage.setItem('theme', newDark ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newDark);
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//       aria-label="Toggle dark mode"
//     >
//       {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-900" />}
//     </button>
//   );
// }

// components/DarkModeToggle.js
'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
    >
      {theme === "dark" ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-200" size={20} />}
    </button>
  );
}



