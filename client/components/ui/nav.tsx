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

    // TODOFake authentication check function
    const fakeAuthCheck = async () => {
      return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true); // Simulate an authenticated user
      }, 1000);
      });
    };

    // TODO: Fake fetch user initial function
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
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
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
            <Link href="/buy" className="hover:text-gray-300">
              Buy Vehicles
            </Link>
          </li>
          <li>
            <Link href="/sell" className="hover:text-gray-300">
              Sell Your Vehicle
            </Link>
          </li>
          <li>
            <Link href="/listings" className="hover:text-gray-300">
              Browse Listings
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About Us
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
              <Link href="/signin" className="hover:text-gray-300">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
