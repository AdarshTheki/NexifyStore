'use client';

import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  ShoppingCart,
  Home,
  ShoppingBasket,
  Heart,
  Contact,
  FileClock,
  MessageCircle,
  Search,
  User,
  X,
} from 'lucide-react';

import SearchSection from './SearchSection';
import useCart from '@/lib/useCart';
import useDropdown from '@/utils/useDropdown';
import LogoSvg from '../utils/LogoSvg';

const NavBar = () => {
  const { user } = useUser();
  const cart = useCart();
  const pathname = usePathname();
  const { isOpen, toggle, dropdownRef } = useDropdown();
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  return (
    <>
      <SearchSection setOpenSearch={setIsOpenSearch} openSearch={isOpenSearch} />
      <div className='backdrop-blur-2xl shadow-md sticky top-0 left-0 w-full z-10'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between py-4'>
            <Link href='/'>
              <LogoSvg />
            </Link>

            <nav className='max-sm:hidden'>
              <ul className='flex items-center gap-4 capitalize'>
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Section */}
            <div className='flex items-center sm:gap-5 gap-3'>
              <Search onClick={() => setIsOpenSearch(true)} className='cursor-pointer' />

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className='absolute text-base-medium w-[80vw] max-w-[400px] overflow-hidden sm:right-10 right-5 top-16 bg-white border shadow-2xl rounded-2xl'>
                  <div className='flex z-50 flex-col'>
                    {navLinks.map((link) => {
                      return (
                        <Link
                          onClick={toggle}
                          href={
                            ['wishlist', 'orders', 'cart', 'comment'].includes(link.name)
                              ? user?.emailAddresses
                                ? link.href
                                : '/sign-in'
                              : link.href
                          }
                          key={link.name}
                          className='hover:text-red-1 flex items-center gap-4 hover:bg-gray-200 capitalize py-3 border-b'>
                          <span className='pl-10'>{link.icon}</span>
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link href='/cart' aria-label='Shopping Cart' className='relative'>
                <ShoppingCart />
                {!!cart?.cartItems?.length && (
                  <span className='absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {cart.cartItems.length}
                  </span>
                )}
              </Link>

              <Link href={'/wishlist'}>
                <Heart />
              </Link>

              {/* User Section */}
              {user?.emailAddresses ? (
                <UserButton afterSignOutUrl='/sign-in' />
              ) : (
                <Link href={'/sign-in'}>
                  <User />
                </Link>
              )}

              {!!isOpen ? (
                <X className='cursor-pointer sm:hidden' onClick={toggle} />
              ) : (
                <Menu className='cursor-pointer sm:hidden' onClick={toggle} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

const navLinks = [
  { href: '/', icon: <Home />, name: 'home' },
  { href: '/products', icon: <ShoppingBasket />, name: 'products' },
  { href: '/contact', icon: <Contact />, name: 'contact' },
  { href: '/orders', icon: <FileClock />, name: 'orders' },
  { href: '/reviews', icon: <MessageCircle />, name: 'comment' },
];
