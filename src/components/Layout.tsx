import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BRAND_ASSETS } from '../data/categories';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAdmin, siteConfig, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardPath = isAdmin
    ? '/dashboard/admin'
    : profile?.role === 'provider'
    ? '/dashboard/provider'
    : '/dashboard/customer';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#18181B]">
      {/* 3-Zone Clean Header with Home Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Original TailsHug Logo (Redirects to Home) */}
          <Link to="/" className="whitespace-nowrap shrink-0 flex items-center focus:outline-none" title="TailsHug Home">
            <img
              src={BRAND_ASSETS.logo}
              alt="TailsHug"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Zone 2: Navigation Links including Home */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
            <Link
              to="/"
              className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                location.pathname === '/' ? 'text-[#F69E40] font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                location.pathname.startsWith('/search') ? 'text-[#F69E40] font-semibold' : ''
              }`}
            >
              Find Services
            </Link>
            <Link
              to="/services"
              className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                location.pathname.startsWith('/services') ? 'text-[#F69E40] font-semibold' : ''
              }`}
            >
              Categories
            </Link>
            <Link
              to="/become-a-provider"
              className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                location.pathname === '/become-a-provider' ? 'text-[#F69E40] font-semibold' : ''
              }`}
            >
              Become a Provider
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                location.pathname === '/about' || location.pathname === '/about-us'
                  ? 'text-[#F69E40] font-semibold'
                  : ''
              }`}
            >
              About Us
            </Link>
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className={`hover:text-[#F69E40] transition-colors whitespace-nowrap shrink-0 ${
                  location.pathname === '/login' ? 'text-[#F69E40] font-semibold' : ''
                }`}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={user ? dashboardPath : '/search'}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#F69E40] hover:bg-[#e58e35] rounded-full transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              {user ? 'Dashboard' : 'Book Pet Care'}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 px-6 py-4 space-y-2.5 text-sm font-medium text-stone-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-1 ${location.pathname === '/' ? 'text-[#F69E40] font-bold' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#F69E40]"
            >
              Find Services
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#F69E40]"
            >
              Categories
            </Link>
            <Link
              to="/become-a-provider"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#F69E40]"
            >
              Become a Provider
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#F69E40]"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#F69E40]"
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-stone-200 flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#F69E40] font-semibold"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/dashboard/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#1F4D3A] font-semibold"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-stone-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-stone-800 font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#F69E40] font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Clean Branded Footer */}
      <footer className="bg-[#111827] text-stone-300 border-t border-stone-800 mt-12">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-block bg-white px-3.5 py-1.5 rounded-xl shrink-0" title="TailsHug Home">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="TailsHug"
                  referrerPolicy="no-referrer"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <div className="text-xs text-stone-400">
                <p className="text-stone-200 font-medium">TailsHug · Trusted Pet Care</p>
                <p>
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-[#F69E40]">
                    {siteConfig.phone}
                  </a>{' '}
                  ·{' '}
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-[#F69E40]">
                    {siteConfig.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-stone-400">
              <Link to="/" className="hover:text-[#F69E40]">
                Home
              </Link>
              <Link to="/services" className="hover:text-[#F69E40]">
                Categories
              </Link>
              <Link to="/search" className="hover:text-[#F69E40]">
                Search
              </Link>
              <Link to="/become-a-provider" className="hover:text-[#F69E40]">
                Become a Provider
              </Link>
              <Link to="/how-it-works" className="hover:text-[#F69E40]">
                How It Works
              </Link>
              <Link to="/about" className="hover:text-[#F69E40]">
                About Us &amp; Founder’s Note
              </Link>
              <Link to="/contact" className="hover:text-[#F69E40]">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-[#F69E40]">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[#F69E40]">
                Terms
              </Link>
              {isAdmin && (
                <Link to="/dashboard/admin" className="text-[#F69E40] font-semibold">
                  Admin Console
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} TailsHug (www.tailshug.com). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300"
              >
                Google Play
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={siteConfig.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300"
              >
                App Store
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
