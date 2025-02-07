import { useEffect, useRef, useState } from "react";

export default function SubtitlePlayer({
  audioUrl,
  transcript,
  onEnded,
}: {
  audioUrl: string | null;
  transcript: string | null;
  onEnded: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);

  useEffect(() => {
    if (audioUrl && transcript) {
      audioRef.current?.addEventListener("loadedmetadata", () => {
        const duration = audioRef.current?.duration || 0;
        if (duration > 0) {
          createSubtitleChunks(transcript, duration);
        }
      });

      const handleTimeUpdate = () => {
        const currentTime = audioRef.current?.currentTime || 0;
        const subtitleIndex = Math.floor(currentTime / 4);
        setCurrentSubtitle(subtitles[subtitleIndex] || null);
      };

      audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioUrl, transcript, subtitles]);

  const createSubtitleChunks = (text: string, duration: number) => {
    const words = text.split(" ");
    const chunks: { text: string; extraDuration: number }[] = [];
    let chunk: string[] = [];
    let extraDuration = 0;

    const punctuationDurations: { [key: string]: number } = {
      ".": 1.0,
      ",": 0.7,
      ";": 0.7,
      "/": 0.7,
      ":": 0.7,
    };

    for (let i = 0; i < words.length; i++) {
      chunk.push(words[i]);

      const match = words[i].match(/[.,;/:]$/);
      if (match) {
        extraDuration += punctuationDurations[match[0]] || 0;
      }

      if (chunk.length >= 8 || i === words.length - 1) {
        chunks.push({
          text: chunk.join(" "),
          extraDuration,
        });
        chunk = [];
        extraDuration = 0;
      }
    }

    setSubtitles(chunks.map((chunk) => chunk.text));

    if (audioRef.current && audioUrl) {
      audioRef.current.play();

      audioRef.current.addEventListener("timeupdate", () => {
        const currentTime = audioRef.current?.currentTime || 0;
        let accumulatedTime = 0;
        let currentSubtitleIndex = 0;

        for (const { text, extraDuration } of chunks) {
          accumulatedTime += 4 + extraDuration;
          if (currentTime <= accumulatedTime) break;
          currentSubtitleIndex++;
        }

        setCurrentSubtitle(chunks[currentSubtitleIndex]?.text || null);
      });
    }
  };

  const handlerEnd = () => {
    setCurrentSubtitle(null);
    onEnded();
  };

  return (
    <div className="w-full h-full relative px-8">
      {currentSubtitle && audioUrl && (
        <>
          <div className="absolute w-full text-center text-white text-base bg-transparent opacity-80">
            {currentSubtitle}
          </div>
        </>
      )}
      <div className="relative w-full text-center opacity-0 text-white text-base ">
        p <br /> p
      </div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={handlerEnd} />}
    </div>
  );
}
