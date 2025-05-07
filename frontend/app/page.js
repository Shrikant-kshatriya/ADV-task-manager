'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-blue-600 opacity-20 blur-3xl rounded-full z-0"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600 opacity-10 blur-2xl rounded-full z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 text-center space-y-6 px-4"
      >
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          TaskFlow
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Manage your team's tasks with clarity and speed. Assign, track, and organize like a pro.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-2xl shadow-lg transition-all duration-200"
        >
          Get Started
        </Link>
      </motion.div>
    </main>
  );
}
