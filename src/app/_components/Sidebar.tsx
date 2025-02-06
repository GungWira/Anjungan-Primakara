import React from "react";
import Image from "next/image";
import SidebarLink from "./SidebarLink";

interface SidebarProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function Sidebar({ isOpen, onClick }: SidebarProps) {
  return (
    <div
      className={`h-screen absolute top-0 ${
        isOpen ? "-left-0" : "-left-full"
      } aspect-[9/16] bg-[#222222] bg-opacity-67 backdrop-blur-[20px]`}
    >
      <div className="flex flex-col justify-start items-start w-3/4 h-screen bg-gradient-to-b from-mainBlue to-darkBlue rounded-tr-xl rounded-br-xl py-8">
        {/* HEADER */}
        <div className="w-full bg-white rounded-md px-6 py-4 flex justify-between items-center">
          <div className="w-32 justify-center items-center overflow-hidden">
            <Image
              src={"/Home/Logo.svg"}
              alt="Logo Primakara"
              width={1}
              height={1}
              className="w-full"
            />
          </div>
          {/* CLOSE */}
          <button
            onClick={onClick}
            className="h-8 aspect-square overflow-hidden flex justify-center items-center"
          >
            <div className="h-8 flex justify-center items-center overflow-hidden">
              <Image
                src={"/Home/Close.svg"}
                alt="Close Icon"
                width={1}
                height={1}
                className="w-full"
              />
            </div>
          </button>
        </div>
        {/*MENU */}
        <div className="w-full px-6 my-8 h-full flex flex-col justify-start items-start gap-2">
          <p className="text-white text-base opacity-80">Menu</p>
          <SidebarLink to="/absensi" icon="/Home/Absen.svg">
            Absensi
          </SidebarLink>
          <SidebarLink to="/primebot" icon="/Home/Bot.svg">
            Primebot
          </SidebarLink>
        </div>

        {/* FOOTER */}
        <div className="w-full flex flex-col justify-start items-start gap-6 px-6">
          <div className="w-full h-1 bg-[#202E5F]"></div>
          <p className="text-white text-base">© 2025 Primakara University</p>
        </div>
      </div>
    </div>
  );
}
