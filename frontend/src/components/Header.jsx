/**
 * Header.jsx — Fixed top navigation bar.
 *
 * Left:   Bloopa logo (overlapping hexagons SVG) + "Bloopa" in Syne 700
 * Center: Network pill — green dot + "ALGORAND TESTNET"
 * Right:  Connect button or address pill + disconnect
 */

import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext.jsx";
import { fmtAddress } from "../utils/format.js";
import { algodClient } from "../utils/algod.js";

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 4L13 1.7L17 4V8.6L13 10.9L9 8.6Z" fill="var(--accent)" opacity="0.6" />
      <path d="M12 8L16 5.7L20 8V12.6L16 14.9L12 12.6Z" fill="var(--accent)" opacity="0.9" />
      <path d="M6 10.5L10 8.2L14 10.5V15.1L10 17.4L6 15.1Z" fill="var(--accent)" opacity="0.4" />
    </svg>
  );
}

function DisconnectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10.5 11.5L14 8l-3.5-3.5M14 8H6"/>
    </svg>
  );
}

export default function Header({ onLogoClick }) {
  const { address, connectPera, connectDefly, disconnect } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [balance, setBalance] = useState(null);

  // Fetch ALGO balance
  useEffect(() => {
    if (!address) { setBalance(null); return; }
    const fetchBal = async () => {
      try {
        const info = await algodClient.accountInformation(address).do();
        setBalance((Number(info.amount) / 1e6).toFixed(2));
      } catch {}
    };
    fetchBal();
    const iv = setInterval(fetchBal, 15000);
    return () => clearInterval(iv);
  }, [address]);

  // Close menu on outside click
  useEffect(() => {
    if (!showWalletMenu) return;
    const handler = () => setShowWalletMenu(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showWalletMenu]);

  return (
    <header
      className="scanlines fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6"
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--bg-border)",
      }}
    >
      {/* Left — Logo (clickable to go back to landing) */}
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
      >
        <LogoMark />
        <span className="font-display font-bold text-lg tracking-tight text-[var(--text-primary)]">
          Bloopa
        </span>
      </button>

      {/* Center — Network pill */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] pulse-dot" />
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Algorand Testnet
        </span>
      </div>

      {/* Right — Wallet */}
      <div className="flex items-center gap-2">
        {address ? (
          <>
            {/* Balance */}
            {balance && (
              <span className="hidden md:inline num text-xs text-[var(--text-secondary)]">
                {balance} ALGO
              </span>
            )}
            {/* Address pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] cursor-default transition-all duration-150 hover:border-[var(--accent)]"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--bg-border)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              <span className="font-mono text-xs text-[var(--text-primary)]">
                {fmtAddress(address)}
              </span>
            </div>
            {/* Disconnect */}
            <button
              id="wallet-disconnect"
              onClick={disconnect}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[var(--text-muted)] transition-all duration-150 hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)]"
              title="Disconnect wallet"
            >
              <DisconnectIcon />
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              id="wallet-connect"
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className="h-9 px-5 rounded-[8px] font-sans font-semibold text-sm text-white transition-all duration-150 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
            >
              Connect Wallet
            </button>
            {showWalletMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-[10px] p-1.5 z-50"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  id="wallet-connect-pera"
                  onClick={() => { connectPera(); setShowWalletMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-[6px] text-sm font-sans text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-elevated)] flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#ffee55", color: "#000" }}>P</span>
                  Pera Wallet
                </button>
                <button
                  id="wallet-connect-defly"
                  onClick={() => { connectDefly(); setShowWalletMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-[6px] text-sm font-sans text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-elevated)] flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#5eead4", color: "#000" }}>D</span>
                  Defly Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
