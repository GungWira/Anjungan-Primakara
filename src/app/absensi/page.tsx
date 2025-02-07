"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Status from "../_components/Status";
import { useRouter } from "next/navigation";

export default function Absensi() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight },
            facingMode: "user",
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.style.objectFit = "cover";
        }
        setTimeout(() => {
          captureImage();
        }, 500);
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };
    startCamera();
  }, []);

  const captureImage = () => {
    setUsername("");
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current
          .toDataURL("image/png")
          .replace(/^data:image\/png;base64,/, "");
        sendImageToAPI(imageData);
      }
    }
  };

  const sendImageToAPI = async (imageData: string) => {
    try {
      const response = await fetch(
        "https://dev.absensi.primakara.ac.id/api/face-scan-v2/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1|Ih1gBdj2s4TDQUXD9DWdXTJYe8RhwCK8G7GNPwFB",
          },
          body: JSON.stringify({ base64: imageData, v3: 1 }),
        }
      );
      const result = await response.json();

      if (result.status === "success") {
        setStatus(true);
        setUsername(result.data.user.nama_lengkap);
      } else {
        setStatus(false);
      }
    } catch (error) {
      console.error("Error sending image to API:", error);
    }
  };

  const handlerRecapture = async () => {
    setStatus(null);
    setTimeout(() => {
      captureImage();
    }, 500);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      router.push("/");
    }, 60000); // 15 detik

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        router.push("/");
      }, 60000);
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("click", resetTimeout);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("click", resetTimeout);
    };
  }, [router]);

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center bg-white">
      <div className="flex flex-col items-center relative h-screen aspect-[9/16]">
        {/* ALERT */}
        <div className="w-full flex justify-center items-center z-50 relative px-6 mt-[7vh] max-w-fit mb-16">
          <div className="w-full bg-[#2f2f2f] bg-opacity-50 backdrop-blur-[8px] flex flex-row justify-center items-center gap-4 px-6 py-3 rounded-full border border-white">
            <div className="w-6 justify-center items-center overflow-hidden ">
              <Image
                src={"/Absensi/Absen.svg"}
                alt="Absen Icon"
                width={1}
                height={1}
                className="w-full"
              />
            </div>
            <p className="text-white text-base">
              Place your face on the scanning box
            </p>
          </div>
        </div>

        {/* BOX */}
        <div className="w-full relative aspect-square z-50 px-8">
          <div className="w-full justify-center items-center overflow-hidden ">
            <Image
              src={"/Absensi/Box.svg"}
              alt="Box Icon"
              width={1}
              height={1}
              className="w-full"
            />
          </div>
        </div>

        {/* CAMERA */}
        <video
          ref={videoRef}
          autoPlay
          className="h-screen absolute top-0 left-0 rounded-lg shadow-md"
        ></video>
        <canvas ref={canvasRef} width={640} height={480} hidden></canvas>

        {/* MANUAL CAPTURE */}
        <div className="w-full flex justify-center items-center px-8 py-8 bg-gradient-to-b from-transparent to-[#474747] bg-opacity-58 backdrop-blur-[8px] absolute bottom-0 left-0">
          <div className="flex justify-center items-center flex-1"></div>
          <div className="flex justify-center items-center flex-1">
            <button
              onClick={captureImage}
              className="w-16 aspect-square bg-transparent overflow-hidden"
            >
              <Image
                src={"/Absensi/Camera.svg"}
                alt="Camera Icon"
                width={1}
                height={1}
                className="w-full"
              />
            </button>
          </div>
          <div className="flex justify-start items-center flex-1">
            <Link
              href={"/"}
              className="w-12 aspect-square flex justify-center items-center"
            >
              <Image
                src={"/Absensi/Close.svg"}
                alt="Close Icon"
                width={1}
                height={1}
                className="w-full"
              />
            </Link>
          </div>
        </div>

        {/* STATUS */}
        <Status
          isValid={status}
          name={username}
          setStatus={() => handlerRecapture()}
        />
      </div>
    </div>
  );
}
