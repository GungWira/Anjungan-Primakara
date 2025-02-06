import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SidebarLinkProps {
  to: string;
  icon: string;
  children: React.ReactNode;
}

export default function SidebarLink({ to, icon, children }: SidebarLinkProps) {
  return (
    <Link
      href={to}
      className="w-full bg-transparent transition-all ease-in-out duration-300 cursor-pointer px-2 hover:px-4 flex flex-row justify-start items-center gap-4 hover:bg-darkBlue py-3 rounded-md"
    >
      <div className="w-6 justify-center items-center overflow-hidden">
        <Image
          src={icon}
          alt="Logo Primakara"
          width={1}
          height={1}
          className="w-full"
        />
      </div>
      <p className="text-base text-white">{children}</p>
    </Link>
  );
}
