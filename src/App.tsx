import { useEffect, useRef, useState, useCallback } from "react";

function useScrollFrames(totalFrames: number, frameFolder: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `${frameFolder}/ezgif-frame-${num}.jpg`;
      img.onload = img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) setLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [totalFrames, frameFolder]);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  return { canvasRef, loaded, loadProgress, renderFrame };
}

const SKILLS = [
  { name: "PYTHON", level: 95, id: "PY-95" },
  { name: "SCIKIT-LEARN", level: 88, id: "SK-88" },
  { name: "TENSORFLOW / PYTORCH", level: 82, id: "DL-82" },
  { name: "OPENCV / MEDIAPIPE", level: 85, id: "CV-85" },
  { name: "DATA ANALYSIS (NUMPY, PANDAS)", level: 90, id: "DA-90" },
  { name: "MODEL DEPLOYMENT (APIs)", level: 75, id: "DEP-75" },
];

const PROJECTS = [
  {
    id: "ML-01",
    title: "MINE_PREDICTION",
    tag: "CLASSIFICATION",
    desc: "Binary classification using sonar sensor data with feature engineering and model evaluation.",
    status: "DEPLOYED",
    tech: "Python • Scikit-learn",
    link: "https://github.com/ramjeemishra/ML_Projects_Basic_to_Advance/blob/main/1_mine_prediction/mine_pridiction.ipynb"
  },
  {
    id: "ML-02",
    title: "DIABETES_RISK_MODEL",
    tag: "HEALTH_AI",
    desc: "Predicting diabetes risk using health metrics built with TensorFlow and NumPy.",
    status: "ACTIVE",
    tech: "TensorFlow • NumPy",
    link: "https://github.com/ramjeemishra/ML_Projects_Basic_to_Advance/blob/main/2_diabetes_prediction/diabetes_prediction.ipynb"
  },
  {
    id: "ML-03",
    title: "GESTURE_RECOGNITION",
    tag: "COMPUTER_VISION",
    desc: "Real-time hand gesture recognition using webcam tracking powered by OpenCV and Mediapipe.",
    status: "LIVE",
    tech: "OpenCV • Mediapipe",
    link: "https://github.com/ramjeemishra/gesture_recogination"
  }
];

export default function StarkApp() {
  const TOTAL_FRAMES = 214;
  const FRAME_FOLDER = "/animation";
  const { canvasRef, loaded, loadProgress, renderFrame } = useScrollFrames(TOTAL_FRAMES, FRAME_FOLDER);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const animSection = document.getElementById("anim-section");
      if (!animSection) return;

      const sectionHeight = animSection.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (scrollY - animSection.offsetTop) / sectionHeight));
      const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      setCurrentFrame(frame);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => renderFrame(currentFrame));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", () => renderFrame(currentFrame));
    };
  }, [currentFrame, renderFrame]);

  useEffect(() => {
    renderFrame(currentFrame);
  }, [currentFrame, renderFrame, loaded]);

  return (
    <div style={{ background: "#FFFFFF", color: "#111", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Syne:wght@800&family=JetBrains+Mono:wght@500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; }

        .dashboard-grid {
          background-image: radial-gradient(#E5E7EB 1.2px, transparent 1.2px);
          background-size: 25px 25px;
        }

        .stark-card {
          background: #FFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 2rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .stark-card:hover {
          border-color: #00D4FF;
          box-shadow: 0 10px 40px -15px rgba(0,212,255,0.3);
          transform: translateY(-3px);
        }

        .nav-link {
          text-decoration: none;
          color: #64748B;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .nav-link:hover { color: #FF3131; }

        /* Responsive Mobile Menu */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: white;
          z-index: 150;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform: translateY(${menuOpen ? "0" : "-100%"});
        }

        .mobile-menu-overlay a {
          font-family: 'Syne';
          font-size: 2.5rem;
          text-decoration: none;
          color: #111;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          section { padding: 80px 5% !important; }
          .hero-text { left: 5% !important; width: 90% !important; }
          .hero-text h1 { font-size: 3.5rem !important; }
          .footer-content { flex-direction: column; gap: 2rem; text-align: center; }
        }
          /* Default: Desktop */
.desktop-nav {
  display: flex;
  gap: 40px;
}

.mobile-btn {
  display: none;
}

/* Mobile */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-btn {
    display: block;
    cursor: pointer;
  }
}
      `}</style>

      {/* Loading Screen */}
      {!loaded && (
        <div style={{ position: "fixed", inset: 0, background: "white", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="arc-spinner" />
          <div style={{ marginTop: 24, fontFamily: "'JetBrains Mono'", fontSize: 12, letterSpacing: 4, color: "#00D4FF" }}>
            LOADING_SEQUENCE_{loadProgress}%
          </div>
        </div>
      )}

      {/* Improved Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6%", zIndex: 200,}}>
        <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 800 }}>
          RAMJEE<span style={{ color: "#FF3131" }}>.</span>AI
        </div>

        <div className="desktop-nav">
          {["PROJECTS", "ARSENAL", "UPLINK"].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">{link}</a>
          ))}
        </div>

        <div className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ zIndex: 201 }}>
          <div style={{ width: 30, height: 2, background: "#111", marginBottom: menuOpen ? 0 : 6, transform: menuOpen ? "rotate(45deg) translateY(1px)" : "none", transition: "0.3s" }}></div>
          <div style={{ width: 30, height: 2, background: "#111", transform: menuOpen ? "rotate(-45deg) translateY(-1px)" : "none", transition: "0.3s" }}></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu-overlay">
        {["projects", "arsenal", "uplink"].map(link => (
          <a key={link} href={`#${link}`} onClick={() => setMenuOpen(false)}>{link.toUpperCase()}</a>
        ))}
      </div>

      {/* Hero Section */}
      <section id="anim-section" className="dashboard-grid" style={{ height: `${TOTAL_FRAMES * 8}px`, position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", opacity: loaded ? 1 : 0 }} />
          <div className="hero-text" style={{ position: "absolute", left: "8%", top: "35%" }}>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#FF3131", letterSpacing: 2 }}>AI & ML ENGINEER</span>
            <h1 style={{ fontFamily: "'Syne'", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.9 }}>
              RAMJEE<br /><span style={{ color: "#111" }}>MISHRA</span>
            </h1>
            <p style={{ marginTop: 24, maxWidth: 500, fontSize: "clamp(1rem, 2vw, 1.1rem)", lineHeight: 1.6, color: "#475569" }}>
              I build practical machine learning systems from data preprocessing and feature engineering to training and deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ padding: "120px 8%", maxWidth: 1400, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Syne'", fontSize: "clamp(2.5rem, 5vw, 3rem)", marginBottom: 60 }}>PROJECTS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: 32 }}>
          {PROJECTS.map(p => (
            <div key={p.id} className="stark-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#94A3B8" }}>{p.id} // {p.tag}</span>
                <span style={{ fontSize: 11, color: "#00D4FF", fontWeight: 700 }}>{p.status}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700 }}>{p.title}</h3>
              <p style={{ color: "#64748B", marginTop: 12, flexGrow: 1 }}>{p.desc}</p>
              <div style={{ marginTop: 20, fontSize: 12, color: "#64748B", borderTop: "1px solid #f1f1f1", paddingTop: 20 }}>{p.tech}</div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 20, fontWeight: 700, color: "#111", textDecoration: "none" }}>
                VIEW_CODE →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Arsenal/Skills Section */}
      <section id="arsenal" className="dashboard-grid" style={{ padding: "120px 8%", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Syne'", fontSize: "clamp(2.5rem, 5vw, 3rem)", marginBottom: 60, textAlign: "center" }}>SKILLS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "40px 60px" }}>
            {SKILLS.map(skill => (
              <div key={skill.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'JetBrains Mono'", fontSize: 13 }}>
                  <span>{skill.name}</span>
                  <span style={{ color: "#00D4FF" }}>{skill.level}%</span>
                </div>
                <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2 }}>
                  <div style={{ width: `${skill.level}%`, height: "100%", background: "#111", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="uplink" style={{ padding: "140px 8%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne'", fontSize: "clamp(3rem, 10vw, 5rem)", marginBottom: 40 }}>CONTACT</h2>
        <a href="mailto:ramjeemishra23@gmail.com" style={{ display: "inline-block", width: "min(100%, 400px)", padding: "20px", border: "2px solid #111", textDecoration: "none", fontWeight: 700, color: "#111", fontSize: 14, letterSpacing: 2 }}>
          SEND_EMAIL
        </a>
      </section>

      {/* Footer */}
      <footer style={{ padding: "60px 8%", borderTop: "1px solid #E2E8F0" }}>
        <div className="footer-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, maxWidth: 1400, margin: "0 auto" }}>
          <div>© 2026 RAMJEE MISHRA // BUILT FOR SCALE</div>
          <div style={{ display: "flex", gap: 32 }}>
            <a href="https://github.com/ramjeemishra" target="_blank" style={{ color: "#64748B", textDecoration: "none" }}>GITHUB</a>
            <a href="https://www.linkedin.com/in/ramjee-mishra-705152291/" target="_blank" style={{ color: "#64748B", textDecoration: "none" }}>LINKEDIN</a>
          </div>
        </div>
      </footer>
    </div>
  );
}