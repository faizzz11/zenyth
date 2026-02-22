import type React from "react"

interface EffortlessIntegrationProps {
  /** Fixed width from Figma: 482px */
  width?: number | string
  /** Fixed height from Figma: 300px */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
}

/**
 * Effortless Integration – Service integration constellation
 * Three concentric rings with logos positioned on ring axes
 */
const EffortlessIntegration: React.FC<EffortlessIntegrationProps> = ({ width = 482, height = 300, className = "" }) => {
  const centerX = 250
  const centerY = 179
  const rings = [
    { radius: 80, logos: 2 }, // Inner ring - 2 logos
    { radius: 120, logos: 3 }, // Middle ring - 3 logos
    { radius: 160, logos: 2 }, // Outer ring - 2 logos
  ]

  const getPositionOnRing = (ringRadius: number, angle: number) => ({
    x: centerX + ringRadius * Math.cos(angle),
    y: centerY + ringRadius * Math.sin(angle),
  })

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.2)",
          opacity: 0.8,
        }}
      />
      {/* Middle ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.25)",
          opacity: 0.7,
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.3)",
          opacity: 0.6,
        }}
      />

      {/* Company logos positioned systematically on ring axes */}
      <div
        style={{
          width: "500px",
          height: "358px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
        }}
      >
        {/* Central hub */}
        <div
          style={{
            width: "72px",
            height: "72px",
            left: `${centerX - 36}px`,
            top: `${centerY - 36}px`,
            position: "absolute",
            background: "oklch(0.6_0.2_45)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#ffffff",
          }}
        >
          M
        </div>

        {/* Epic Systems - 180° (left) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(80, Math.PI).x - 20}px`,
            top: `${getPositionOnRing(80, Math.PI).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#0066CC"/>
            <path d="M6 8L12 4L18 8V16L12 20L6 16V8Z" fill="white"/>
            <path d="M9 12L12 10L15 12V15L12 17L9 15V12Z" fill="#0066CC"/>
          </svg>
        </div>

        {/* Cerner - 0° (right) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(80, 0).x - 20}px`,
            top: `${getPositionOnRing(80, 0).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#003366"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
            <path d="M9 12L11 14L15 10" stroke="#003366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Allscripts - 315° (top-right) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(120, -Math.PI / 4).x - 20}px`,
            top: `${getPositionOnRing(120, -Math.PI / 4).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#008080"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
          </svg>
        </div>

        {/* Practice Fusion - 135° (bottom-left) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(120, (3 * Math.PI) / 4).x - 20}px`,
            top: `${getPositionOnRing(120, (3 * Math.PI) / 4).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#00A651"/>
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="white"/>
          </svg>
        </div>

        {/* NextGen - 225° (bottom-left diagonal) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(120, (5 * Math.PI) / 4).x - 20}px`,
            top: `${getPositionOnRing(120, (5 * Math.PI) / 4).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#6B46C1"/>
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* eClinicalWorks - 180° (left) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(160, Math.PI).x - 20}px`,
            top: `${getPositionOnRing(160, Math.PI).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#FF6B35"/>
            <path d="M6 6H18V18H6V6Z" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M9 9H15M9 12H15M9 15H12" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        {/* Athenahealth - 0° (right) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            left: `${getPositionOnRing(160, 0).x - 20}px`,
            top: `${getPositionOnRing(160, 0).y - 20}px`,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#E91E63"/>
            <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M12 6V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(55, 50, 47, 0.1)" />
              <stop offset="50%" stopColor="rgba(55, 50, 47, 0.05)" />
              <stop offset="100%" stopColor="rgba(55, 50, 47, 0.1)" />
            </linearGradient>
          </defs>

          {/* Inner ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(80, 0).x}
            y2={getPositionOnRing(80, 0).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(80, Math.PI).x}
            y2={getPositionOnRing(80, Math.PI).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Middle ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, -Math.PI / 4).x}
            y2={getPositionOnRing(120, -Math.PI / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, (3 * Math.PI) / 4).x}
            y2={getPositionOnRing(120, (3 * Math.PI) / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, (5 * Math.PI) / 4).x}
            y2={getPositionOnRing(120, (5 * Math.PI) / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />

          {/* Outer ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(160, 0).x}
            y2={getPositionOnRing(160, 0).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.1"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(160, Math.PI).x}
            y2={getPositionOnRing(160, Math.PI).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.1"
          />
        </svg>
      </div>
    </div>
  )
}

export default EffortlessIntegration
