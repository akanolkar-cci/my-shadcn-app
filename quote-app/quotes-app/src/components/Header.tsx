"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
const Header: React.FC = () => {
  return (
    <header className="bg-green-500 w-full flex items-center justify-between px-4 py-2 shadow-md">
      <div className="text-white text-lg font-bold">
        Software Quotes
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-white text-md">Quotes</span>
        </Link>
        <Link href="/auth/signin">
          <Button className="bg-white text-black px-4 py-2 rounded-md shadow-sm">
            Login/Signup
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
