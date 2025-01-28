'use client';
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/customButton";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white bg-purple-600 py-2 pl-6 rounded-t-md">
            Sign Up
          </h1>
          <form className="space-y-4 p-6 pb-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                User name
              </label>
              <Input 
                type="text" 
                placeholder="Enter your username" 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-center items-center mx-auto py-4">
              <Button 
                type="submit" 
                className="bg-purple-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
              >
                Sign Up
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-400 text-white px-6 py-2 ml-4 rounded-md shadow-md hover:bg-orange-500 focus:ring-2 focus:ring-orange-500"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
