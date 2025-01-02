import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Nav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user initial from the backend using the user_id
    const fetchUserInitial = async (userId: string) => {
      const response = await fetch(`http://127.0.0.1:8000/get_user_data?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const username = data.user.username;
        return username.charAt(0).toUpperCase()
      } else {
        return 'U';  // Default fallback in case of error
      }
    };
    const checkAuth = async () => {
      // Check if the user_id exists in localStorage (indicating they are authenticated)
      const userId = localStorage.getItem("user_id");
      if (userId) {
        setIsAuthenticated(true);

        // Fetch the user's username from the backend
        const username = await fetchUserInitial(userId);
        setUserInitial(username);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();


  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Remove user_id from localStorage and update the state
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setUserInitial('');
  };

  return (
    <nav className="bg-[#365E84] text-white p-3 w-full">
      <div className="container mx-auto flex items-center">
        <img src="/icons/SecondWheelsIcon2.svg" alt="SecondWheels Logo" className="w-12 h-12" />
        <Link href="/" className="text-xl font-bold mr-80 ml-1">
          SecondWheels
        </Link>
        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>
        <ul className={`flex-col md:flex-row md:flex space-x-20 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex items-center`}>
          <li>
            <Link href="/" className="hover:text-gray-300">
              Buy
            </Link>
          </li>
          <li>
            <Link href="/sell" className="hover:text-gray-300">
              Sell
            </Link>
          </li>
          <li>
            <Link href="/listings" className="hover:text-gray-300">
              Browse
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <Link href="/profile">
                <div className="bg-white text-[#365E84] rounded-full w-8 h-8 flex items-center justify-center font-semibold hover:bg-gray-200 transition-colors">
                  {userInitial}
                </div>
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="bg-white text-[#365E84] hover:bg-gray-200 font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Button
                variant="outline"
                className="bg-white text-[#365E84] hover:bg-gray-200 font-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
