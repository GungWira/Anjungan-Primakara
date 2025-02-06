import Image from "next/image";
import React from "react";

interface LoadingProps {
  loading: boolean;
}

export default function Loading({ loading }: LoadingProps) {
  return (
    <div
      className={`h-screen overflow-hidden fixed z-50 justify-center items-center bg-white aspect-[9/16] ${
        loading ? "flex" : "hidden"
      }`}
    >
      {/* MAIN */}
      <div className="flex flex-col justify-center relative  h-full items-center px-8 w-3/4 gap-16 ">
        <div className="w-full justify-center items-center overflow-hidden">
          <Image
            src={"/Home/Logo.svg"}
            alt="Logo Primakara"
            width={1}
            height={1}
            className="w-full"
          />
        </div>
        {/* PROGRESS BAR */}
        <div className="w-[90%] justify-start items-start h-3 rounded-xl bg-[#E6E6E6] overflow-hidden mb-24">
          <div
            className="h-full bg-gradient-to-r from-[#1C2A58] to-[#149FA9] rounded-xl transition-all ease-in-out duration-300"
            style={{ width: "80%" }}
          ></div>
        </div>

        {/* COPYRIGHT */}
        <p className="text-[#1C2A58] text-xl absolute bottom-16">
          © 2025 Primakara University
        </p>
      </div>
      {/* ORNAMEN */}
      <div className="w-1/2 h-auto absolute bottom-0 left-0">
        <Image
          src={"/Home/Ornament.svg"}
          alt="Logo Primakara"
          width={1}
          height={1}
          className="w-full aspect-square"
        />
      </div>
      <div className="w-1/2 h-auto absolute top-0 right-0 rotate-180">
        <Image
          src={"/Home/Ornament.svg"}
          alt="Logo Primakara"
          width={1}
          height={1}
          className="w-full aspect-square"
        />
      </div>
    </div>
  );
}
