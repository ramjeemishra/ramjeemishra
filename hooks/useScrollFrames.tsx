import { useEffect, useRef, useCallback } from "react";

export function useScrollFrames(totalFrames: number, frameFolder: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(false);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(totalFrames);

    const onLoad = () => {
      loadedCountRef.current++;
      if (loadedCountRef.current === totalFrames) {
        loadedRef.current = true;
        // Render first frame once all loaded
        renderFrame(0);
      }
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      // Try both naming conventions — adjust the one below to match YOUR files
      // e.g. frame_0001.jpg  OR  0001.jpg  OR  frame0001.jpg
      const num = String(i + 1).padStart(4, "0");
      img.src = `${frameFolder}/frame_${num}.jpg`;
      img.onload = onLoad;
      img.onerror = onLoad; // count errors too so we don't hang
      images[i] = img;
    }

    imagesRef.current = images;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFrames, frameFolder]);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas resolution to image
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);
  }, []);

  // Expose loaded as a boolean getter so Hero can react
  const loaded = loadedRef.current;

  return { canvasRef, loaded, renderFrame };
}