import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Welcome to TaskFlow</h1>
        <p className="text-gray-400">Manage your team tasks effortlessly.</p>
        <Link href="/login" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">Get Started</Link>
      </div>
    </main>
  );
}