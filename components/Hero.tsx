// import type { RefObject } from "react";

interface HeroProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  loaded: boolean;
  currentFrame: number;
  scrollY: number;
  totalFrames: number;
}

export default function Hero({ canvasRef, loaded, currentFrame, scrollY, totalFrames }: HeroProps) {
  // Hero text fades out in first 40% of viewport height of scroll
  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.4));

  return (
    /* sticky: stays fixed while parent (#anim-section) scrolls past */
    <div
      id="status"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Canvas — renders current frame */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s",
          background: "#000",
        }}
      />

      {/* Overlay gradient for readability */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Loading indicator — shows until all frames preloaded */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 20, background: "#000",
        }}>
          <div style={{
            width: 60, height: 60,
            border: "2px solid #111",
            borderTop: "2px solid #ff003c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <span style={{ fontSize: 11, color: "#ff003c", letterSpacing: "0.2em" }}>
            LOADING SEQUENCE
          </span>
        </div>
      )}

      {/* Hero text — fades as user scrolls */}
      <div style={{
        position: "absolute",
        bottom: 80, left: 60, right: 60,
        opacity: heroOpacity,
        transform: `translateY(${scrollY * 0.08}px)`,
        pointerEvents: "none",
        transition: "transform 0.05s linear",
      }}>
        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#ff003c",
            boxShadow: "0 0 12px #ff003c",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 10, color: "#ff003c", letterSpacing: "0.2em" }}>
            SYSTEM ONLINE · AI/ML ENGINEER
          </span>
        </div>

        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(40px, 7vw, 100px)",
          lineHeight: 0.9,
          letterSpacing: "-0.03em",
          marginBottom: 20,
        }}>
          STARK<br />
          <span style={{ color: "#ff003c" }}>INTEL</span>
        </h1>

        <p style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "#00f2ff",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}>
          PROTOCOL: ARTIFICIAL INTELLIGENCE
        </p>
      </div>

      {/* Frame counter HUD */}
      <div style={{
        position: "absolute", top: 72, right: 32,
        fontFamily: "monospace", fontSize: 10,
        color: "#ff003c", opacity: 0.6, letterSpacing: "0.1em",
      }}>
        FRAME {String(currentFrame + 1).padStart(3, "0")} / {totalFrames}
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 24, right: 32,
        opacity: scrollY < 60 ? 1 : 0,
        transition: "opacity 0.4s",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 1, height: 48,
          background: "linear-gradient(to bottom, #ff003c, transparent)",
        }} />
        <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", writingMode: "vertical-rl" }}>
          SCROLL
        </span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px #ff003c; }
          50% { opacity: 0.4; box-shadow: 0 0 4px #ff003c; }
        }
      `}</style>
    </div>
  );
}