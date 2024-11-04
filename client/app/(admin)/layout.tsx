import { ReactNode } from "react";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // You can add additional admin role checks here if needed
  // if (session.user.role !== 'admin') {
  //   redirect('/')
  // }

  return <div className="h-full w-full bg-gray-100">{children}</div>;
}
