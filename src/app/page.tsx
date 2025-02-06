"use client";

import React, { useState } from "react";
import Loading from "./_components/Loading";
import Image from "next/image";
import Sidebar from "./_components/Sidebar";

export default function Home() {
  return (
    <div className="bg-white w-screen relative h-screen flex justify-center items-center">
      <Loading loading={false} />
      {/* MAIN */}
      <div className="h-full relative aspect-[9/16] bg-slate-200 px-8 overflow-hidden">
        {/* BUTTON MAIN MENU */}
        <button className="w-16 z-40 flex justify-center items-center absolute bottom-8 cursor-pointer aspect-square rounded-full bg-lightBlue hover:bg-[#2bbcc6] transition-all ease-in-out duration-500">
          <div className="w-6 justify-center items-center overflow-hidden">
            <Image
              src={"/Home/Menu.svg"}
              alt="Menu Primakara"
              width={1}
              height={1}
              className="w-full"
            />
          </div>
        </button>
        {/* SIDEBAR */}
        <Sidebar />
      </div>
    </div>
  );
}
