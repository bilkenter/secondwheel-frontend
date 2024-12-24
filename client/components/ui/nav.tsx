import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Nav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate an authentication check
    const checkAuth = async () => {
      // Replace this with your actual authentication logic
      const isAuthenticated = await fakeAuthCheck();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
      // Simulate fetching user initial
      const userInitial = await fetchUserInitial();
      setUserInitial(userInitial);
      }
    };

    checkAuth();

    // Fake authentication check function
    const fakeAuthCheck = async () => {
      return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true); // Simulate an authenticated user
      }, 1000);
      });
    };

    // Fake fetch user initial function
    const fetchUserInitial = async () => {
      return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('A'); // Simulate fetching user initial
      }, 500);
      });
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#365E84] text-white p-3 w-full">
      <div className="container mx-auto flex items-center">
      <img src="/icons/SecondWheelsIcon2.svg" alt="SecondWheels Logo" className="w-12 h-12"/>
        <Link href="/" className="text-xl font-bold mr-80 ml-1">
          SecondWheels
        </Link>
        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>
        <ul className={`flex-col md:flex-row md:flex space-x-20 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
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
              <Link href="/profile" className="hover:text-gray-300">
                {userInitial}
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
