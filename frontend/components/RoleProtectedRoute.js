'use client';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  if (!user || !allowedRoles.includes(user.role)) {
    router.push('/login');
    return null;
  }

  return children;
}