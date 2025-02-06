import React from "react";
import Image from "next/image";
import Link from "next/link";

interface StatusProps {
  isValid: boolean | null;
  name?: string;
  setStatus?: () => void;
}

export default function Status({ isValid, name, setStatus }: StatusProps) {
  return isValid == null ? (
    ""
  ) : (
    <div className="w-full absolute h-screen flex justify-center z-50 items-center bg-[#2f2f2f] bg-opacity-50 backdrop-blur-[8px]">
      <div className="flex flex-col w-full max-w-80 px-8 py-8 rounded-3xl bg-white gap-4">
        <div className="w-[75%] min-w-64 aspect-square justify-center items-center overflow-hidden ">
          <Image
            src={isValid ? "/Absensi/Success.svg" : "/Absensi/Fail.svg"}
            alt="Success Icon"
            width={1}
            height={1}
            className="w-full"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-mainBlue text-2xl font-bold">
            {isValid ? "BERHASIL" : "GAGAL"}
          </h1>
          {isValid ? (
            <p className="text-mainBlue text-base opacity-80 text-center">
              Berhasil melakukan absensi atas nama{" "}
              <span className="opacity-100 font-bold">{name}</span>
            </p>
          ) : (
            <p className="text-mainBlue text-base opacity-80 text-center">
              Gagal melakukan absensi wajah, mohon mencoba kembali
            </p>
          )}
        </div>
        {/* BUTTON */}
        {isValid ? (
          <div className="flex w-full justify-center items-center">
            <Link
              href={"/"}
              className="w-full py-2 text-white bg-darkBlue rounded-md flex justify-center items-center font-semibold"
            >
              Kembali
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-start items-start gap-2">
            <button
              onClick={setStatus}
              className="w-full py-2 text-white bg-darkBlue rounded-md flex justify-center items-center font-semibold"
            >
              Coba Lagi
            </button>
            <Link
              href={"/"}
              className="w-full py-2 text-darkBlue border border-darkBlue bg-transparent opacity-80 rounded-md flex justify-center items-center font-semibold"
            >
              Kembali
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
