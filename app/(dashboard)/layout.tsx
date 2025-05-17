'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.email) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/users/email/${session.user.email}`);
        const data = await res.json();
        
        if (data.role === "user") {
          router.push('/');
        }
      } catch (error) {
        console.error("Failed to check user role:", error);
        router.push('/');
      }
    };

    if (status === "unauthenticated") {
      router.push('/');
    } else if (status === "authenticated") {
      checkUserRole();
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}