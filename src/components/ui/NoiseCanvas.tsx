"use client";

import {useCallback, useEffect, useRef} from "react";

const NoiseCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateNoise = useCallback((ctx: CanvasRenderingContext2D) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const idata = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(idata.data.buffer);

    for (let i = 0; i < buffer32.length; i++) {
      if (Math.random() < 0.01) { // density: lower the comparision value => lesser the number of particles
        buffer32[i] = 0xff000000;
      }
    }

    ctx.putImageData(idata, 0, 0);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const interval = setInterval(() => generateNoise(ctx), 90); // speed or initrval (less interval more speed)
    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, [generateNoise]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none blur-[0px] opacity-[0.5] z-50 mix-blend-overlay"
    />
  );
};

export default NoiseCanvas;
