'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Shield, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface UserMenuProps {
  session: Session;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session.user;
  const avatarUrl = user?.image;
  const userName = user?.name || user?.email || 'User';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800/50 border border-zinc-800/40 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full border border-indigo-500/20 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent border border-indigo-500/20 flex items-center justify-center text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-medium text-zinc-300 max-w-[120px] truncate">
          {userName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-xl border border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl p-2 shadow-xl shadow-black/40 z-50"
          >
            {/* User Info Header */}
            <div className="px-3 py-2.5 border-b border-zinc-900 mb-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'CareerPilot User'}</p>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/dashboard';
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 rounded-lg hover:bg-zinc-900/50 hover:text-white transition-all text-left"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                Dashboard
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/history';
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 rounded-lg hover:bg-zinc-900/50 hover:text-white transition-all text-left"
              >
                <UserIcon className="w-4 h-4 text-pink-400" />
                Analysis History
              </button>
            </div>

            {/* Separator */}
            <div className="h-px bg-zinc-900 my-1"></div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-400 rounded-lg hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
