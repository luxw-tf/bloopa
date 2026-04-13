/**
 * Footer.jsx — Fixed bottom status bar.
 *
 * Left:   Live round number from algodClient.status()
 * Center: App ID with explorer link
 * Right:  Treasury balance (placeholder until global state read)
 *
 * All text: mono 11px --text-muted
 * Round number pulses on each block refresh.
 */

import React, { useState, useEffect, useRef } from "react";
import { algodClient } from "../utils/algod.js";
import { APP_ID } from "../utils/contract.js";
import { fmtRound } from "../utils/format.js";

export default function Footer() {
  const [round, setRound] = useState(null);
  const [pulsing, setPulsing] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await algodClient.status().do();
        const r = status["last-round"];
        setRound(r);
        // Trigger pulse
        setPulsing(true);
        setTimeout(() => setPulsing(false), 1000);
      } catch (err) {
        console.log("Footer status fetch:", err.message);
      }
    };

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 10000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-4 md:px-6"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--bg-border)",
      }}
    >
      {/* Left — Round number */}
      <span
        className="font-mono text-[11px] transition-opacity duration-500"
        style={{
          color: "var(--text-muted)",
          opacity: pulsing ? 1 : 0.6,
        }}
      >
        {round ? `ROUND ${fmtRound(round)}` : "CONNECTING..."}
      </span>

      {/* Center — App ID */}
      <a
        href={`https://testnet.explorer.perawallet.app/application/${APP_ID}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] transition-colors duration-150 hover:text-[var(--accent)]"
        style={{ color: "var(--text-muted)" }}
      >
        APP {APP_ID}
      </a>

      {/* Right — Network indicator */}
      <span
        className="font-mono text-[11px]"
        style={{ color: "var(--text-muted)" }}
      >
        ALGORAND TESTNET
      </span>
    </footer>
  );
}
