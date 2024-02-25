import { BsMoon, BsMoonFill } from "react-icons/bs";

export const Navbar = ({ theme: [darkMode, setDarkMode] }) => {
  const toggleDarkMode = async () => {
    setDarkMode(!darkMode);
    localStorage.theme = darkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`relative flex justify-between px-5 py-8 bg-white shadow-sm drop-shadow md:px-16 xl:px-20 dark:bg-dark-blue dark:text-white fixed top-0 left-0 right-0 z-10`}>
      <h1 className="font-bold text-lg md:text-xl xl:text-2xl">Filter Best Profile</h1>
      
      <button className="flex items-center font-semibold xl:text-lg" onClick={toggleDarkMode}>
        {darkMode ? <BsMoonFill className="mr-1"/> : <BsMoon className="mr-1"/>}
        Dark
      </button>
    </nav>
  );
};

export default Navbar;
