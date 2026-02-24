'use client';

import React from 'react';
import { Home, Coffee, Droplet, Wheat, UtensilsCrossed, Cake, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const Sidebar = ({ activeCategory, onCategoryChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'coffee', name: 'Coffee', icon: Coffee },
    { id: 'juice', name: 'Juice', icon: Droplet },
    { id: 'milk-blend', name: 'Milk Blend', icon: Wheat },
    { id: 'snack', name: 'Snack', icon: UtensilsCrossed },
    { id: 'rice', name: 'Rice', icon: Wheat },
    { id: 'dessert', name: 'Dessert', icon: Cake },
  ];

  const bottomMenuItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'logout', name: 'Logout', icon: LogOut },
  ];

  return (
    <div className="w-24 bg-sidebar text-sidebar-foreground flex flex-col items-center py-6 space-y-8 min-h-screen">
      {/* Logo */}
      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-foreground">K</span>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground'
              }`}
              title={item.name}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 text-center">{item.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="space-y-4">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-16 h-16 rounded-lg flex flex-col items-center justify-center hover:bg-sidebar-accent transition-all"
              title={item.name}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 text-center">{item.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
