import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface NavbarProps {
  onNavigate: (view: 'home' | 'gallery') => void;
  currentView: 'home' | 'gallery';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const getLinkClass = (view: 'home' | 'gallery') => 
    `text-lg cursor-pointer ${currentView === view ? 'font-bold text-primary' : ''}`;

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Bars3Icon className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={() => onNavigate('home')} className={currentView === 'home' ? 'active' : ''}>Home</a></li>
            <li><a onClick={() => onNavigate('gallery')} className={currentView === 'gallery' ? 'active' : ''}>Gallery</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" onClick={() => onNavigate('home')}>Virtual Try-On</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <li><a onClick={() => onNavigate('home')} className={getLinkClass('home')}>Home</a></li>
          <li><a onClick={() => onNavigate('gallery')} className={getLinkClass('gallery')}>Gallery</a></li>
        </ul>
      </div>
      <div className="navbar-end">
      </div>
    </div>
  );
};

export default Navbar;
