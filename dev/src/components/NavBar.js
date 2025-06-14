// 'use client';

// import DarkModeToggle from './DarkMode';

// export default function Navbar() {
//   return (    
//     <header className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-900 shadow-md dark:shadow-md z-50 fixed top-0 left-0">
//       <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
//         CreditSense
//       </h1>
//       <DarkModeToggle />
//     </header>
//   );
// }


// components/NavBar.js
'use client';

import { useTheme } from 'next-themes';

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  return (    
    <header className="w-full rounded-b-3xl px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-neutral-900/80 shadow-sm backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 z-50 fixed top-0 left-0 ">
      <h1 className="text-5xl font-extrabold italic text-neutral-600 dark:text-neutral-100">
        Pay<span className='text-gray-400'>Score</span>
      </h1>
      {/* <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button> */}
    </header>
  );
}
