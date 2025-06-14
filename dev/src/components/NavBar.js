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
// import DarkModeToggle from './DarkMode';

export default function NavBar() {
  return (
    <nav className="w-full px-6 py-4 bg-blue-900 text-white border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center sticky top-0">
      <h1 className="text-5xl font-bold">Pay<span className='text-blue-500'>Score</span></h1>
      {/* <DarkModeToggle /> */}
    </nav>
  );
}
