"use client";
import { useState, useEffect, useRef } from "react";
import VideoPlayer from "../_components/VideoPlayer";
import Image from "next/image";
import Link from "next/link";
import SubtitlePlayer from "../_components/Subtitle";
import Loading from "../_components/Loading";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<
    "transform" | "idle" | "hearing" | "searching" | "speaking" | "loading"
  >("loading");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const isHolding = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const transformVideoRef = useRef<HTMLVideoElement>(null);
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const hearingVideoRef = useRef<HTMLVideoElement>(null);
  const searchingVideoRef = useRef<HTMLVideoElement>(null);
  const speakingVideoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let loadedCount = 0;

    const handleVideoLoad = () => {
      loadedCount++;
      if (loadedCount <= 5) {
        if (loadedCount === 5) {
          setIsLoading(false);
          setTimeout(() => {
            setState("transform");
          }, 3000);
        }
      }
    };

    if (transformVideoRef.current != null) {
      transformVideoRef.current.addEventListener("canplay", handleVideoLoad);
    }
    if (idleVideoRef.current != null) {
      idleVideoRef.current.addEventListener("canplay", handleVideoLoad);
    }
    if (hearingVideoRef.current != null) {
      hearingVideoRef.current.addEventListener("canplay", handleVideoLoad);
    }
    if (searchingVideoRef.current != null) {
      searchingVideoRef.current.addEventListener("canplay", handleVideoLoad);
    }
    if (speakingVideoRef.current != null) {
      speakingVideoRef.current.addEventListener("canplay", handleVideoLoad);
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "id-ID";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        sendToBackend(transcript);
      };

      recognition.onend = () => {
        if (isHolding.current) {
          recognition.stop();
        }

        if (state === "searching") {
          setState("idle");
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const handleVideoEnd = () => {
    if (state === "transform") {
      setState("idle");
    }
  };

  const handleHoldStart = () => {
    isHolding.current = true;
    setState("hearing");

    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleHoldEnd = () => {
    isHolding.current = false;
    setState("idle");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendToBackend = async (text: string) => {
    setState("searching");
    try {
      const response = await fetch(
        "https://chatbackend.primakara.ac.id/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOT_KEY}`,
          },
          body: JSON.stringify({ query: text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await response.json();
      // console.log(data);
      setAudioUrl(data.voice);
      setTranscript(data.text);
      setState("speaking");
    } catch (error) {
      console.error("Error fetching response:", error);
      setState("idle");
    }
  };

  const handleAudioEnd = () => {
    setAudioUrl(null);
    setState("idle");
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
    <div className="w-full h-screen bg-white overflow-hidden flex flex-col justify-center items-center relative min-h-screen">
      <Loading loading={isLoading} />
      <div
        className={`h-screen aspect-[9/16] flex justify-center items-center relative bg-black ${
          isLoading ? "z-0" : "z-50"
        }`}
      >
        {/* HEAD */}
        <div className="w-full absolute top-0 left-0 flex justify-between items-center px-8 py-8">
          <Link href={"/"}>
            <div className="h-10 justify-center items-center overflow-hidden">
              <Image
                src={"/Primebot/Logo.svg"}
                alt="Logo Primakara"
                width={1}
                height={1}
                className="h-full w-auto"
              />
            </div>
          </Link>

          {/* LANGUAGE */}
          <div className="w-fit px-4 py-1 rounded-full bg-white flex flex-row justify-center items-center gap-2">
            <div className="w-6 justify-center items-center overflow-hidden rounded-full">
              <Image
                src={"/Primebot/ID.svg"}
                alt="Logo ID"
                width={1}
                height={1}
                className="w-full"
              />
            </div>
            <p className="text-darkBlue text-sm">ID</p>
          </div>
        </div>
        {/* VIDEO */}
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <div className="flex justify-center flex-col items-center w-[100%] relative overflow-hidden">
            <VideoPlayer
              src="Primebot/Berubah.mov"
              isActive={state === "transform"}
              onEnded={handleVideoEnd}
              videoRef={transformVideoRef}
            />
            <VideoPlayer
              src="Primebot/Diam.mov"
              isActive={state === "idle"}
              videoRef={idleVideoRef}
              position={"relative"}
              loop={true}
            />
            <VideoPlayer
              src="Primebot/Mendengarkan.mov"
              isActive={state === "hearing"}
              videoRef={hearingVideoRef}
            />
            <VideoPlayer
              src="Primebot/Mencari.mov"
              isActive={state === "searching"}
              loop
              videoRef={searchingVideoRef}
            />
            <VideoPlayer
              src="Primebot/Berbicara.mov"
              isActive={state === "speaking"}
              loop
              videoRef={speakingVideoRef}
            />
          </div>
          <SubtitlePlayer
            audioUrl={audioUrl}
            transcript={transcript}
            onEnded={handleAudioEnd}
          />
        </div>

        {/* ACTION */}
        <div className="absolute bottom-16 flex justify-center items-center w-full">
          <div className="flex justify-center items-center flex-1"></div>
          <div className="flex justify-center items-center flex-1">
            {/* MIC */}
            {state != "speaking" ? (
              <button
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                className="p-5 rounded-full aspect-square relative overflow-visible bg-lightBlue hover:bg-[#2bbcc6]"
              >
                {state == "hearing" && (
                  <>
                    <div className="absolute inset-0 animate-ring rounded-full border border-[#1cdeec] opacity-50"></div>
                    <div
                      className="absolute inset-0 animate-ring rounded-full border border-[#1cdeec] opacity-50"
                      style={{ animationDelay: "250ms" }}
                    ></div>
                  </>
                )}
                <div className="w-6 justify-center items-center overflow-hidden">
                  <Image
                    src={"/Primebot/Mic.svg"}
                    alt="Logo Mic"
                    width={1}
                    height={1}
                    className="w-full"
                  />
                </div>
              </button>
            ) : (
              <button
                onClick={handleAudioEnd}
                className="p-5 rounded-full aspect-square relative overflow-visible bg-lightBlue hover:bg-[#2bbcc6]"
              >
                <div className="w-4 justify-center items-center overflow-hidden">
                  <Image
                    src={"/Primebot/Close.svg"}
                    alt="Logo Mic"
                    width={1}
                    height={1}
                    className="w-full"
                  />
                </div>
              </button>
            )}
          </div>
          <div className="flex justify-start items-center flex-1">
            {/* HOME LINK */}
            <Link href={"/"} className="w-12 aspect-square overflow-hidden">
              <div className="w-full justify-center items-center overflow-hidden">
                <Image
                  src={"/Primebot/Home.svg"}
                  alt="Logo Home"
                  width={1}
                  height={1}
                  className="w-full"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
