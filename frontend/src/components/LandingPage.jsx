/**
 * LandingPage.jsx — Premium hero landing page for Bloopa.
 *
 * Inspired by Hyperliquid, EigenLayer, and Morpho marketing pages.
 * Full-viewport hero with animated background, feature grid,
 * protocol stats, and how-it-works flow.
 */

import React, { useState, useEffect } from "react";
import { algodClient } from "../utils/algod.js";
import { APP_ID } from "../utils/contract.js";

/* ── Animated floating particles background ── */
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: i % 3 === 0 ? "var(--accent)" : i % 3 === 1 ? "var(--success)" : "var(--text-muted)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Network Status Badge ── */
function NetworkBadge() {
  const [round, setRound] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const s = await algodClient.status().do();
        setRound(s["last-round"]);
      } catch {}
    };
    fetch();
    const iv = setInterval(fetch, 10000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
    >
      <span className="w-2 h-2 rounded-full bg-[var(--success)] pulse-dot" />
      <span className="font-mono text-[11px] text-[var(--success)] uppercase tracking-wider">
        Algorand Testnet
      </span>
      {round && (
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          #{round.toLocaleString()}
        </span>
      )}
    </div>
  );
}

/* ── Animated stat counter ── */
function AnimatedStat({ label, value, suffix = "" }) {
  return (
    <div className="text-center">
      <div className="num text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">
        {value}<span className="text-lg text-[var(--text-muted)] ml-1">{suffix}</span>
      </div>
      <div className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
        {label}
      </div>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon, title, description, accentColor = "var(--accent)" }) {
  return (
    <div
      className="group card p-6 hover:border-[var(--accent)] transition-all duration-300 cursor-default"
      style={{ "--card-accent": accentColor }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}25`,
        }}
      >
        <span className="text-xl" style={{ color: accentColor }}>{icon}</span>
      </div>
      <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[13px] font-sans text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── How It Works Step ── */
function Step({ number, title, description, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 num text-sm font-bold"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "var(--accent)",
          }}
        >
          {number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 my-2" style={{ background: "var(--bg-border)" }} />
        )}
      </div>
      <div className="pb-8">
        <h4 className="font-display font-bold text-sm text-[var(--text-primary)] mb-1">
          {title}
        </h4>
        <p className="text-[13px] font-sans text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Credit Formula Visual ── */
function FormulaCard() {
  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)] mb-6">
        Credit Limit Formula
      </h3>
      <div className="space-y-3">
        {[
          { label: "Base Credit", formula: "stake × 2", color: "var(--accent)" },
          { label: "History Bonus", formula: "payments × 0.5 ALGO", color: "var(--success)" },
          { label: "Repaid Bonus", formula: "total_repaid ÷ 10", color: "var(--warning)" },
          { label: "Hard Cap", formula: "stake × 10", color: "var(--danger)" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--bg-border)" }}>
            <span className="text-xs font-sans text-[var(--text-secondary)]">{row.label}</span>
            <span className="num text-sm font-semibold" style={{ color: row.color }}>{row.formula}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Landing Page ── */
export default function LandingPage({ onLaunchApp }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleField />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 md:pt-32 pb-20 px-4">
        <div className="max-w-[960px] mx-auto text-center">
          <NetworkBadge />

          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.95] mt-8 mb-6">
            <span className="text-[var(--text-primary)]">Credit for</span>
            <br />
            <span
              className="bg-gradient-to-r from-[var(--accent)] via-[#818cf8] to-[var(--accent)] bg-clip-text"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              Autonomous Agents
            </span>
          </h1>

          <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-10">
            The first on-chain credit protocol for AI agents.
            Stake ALGO. Build reputation. Draw undercollateralised credit.
            No human in the loop.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="launch-app-hero"
              onClick={onLaunchApp}
              className="h-12 px-8 rounded-[8px] font-sans font-semibold text-sm text-white transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] active:scale-[0.98]"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
            >
              Launch Protocol →
            </button>
            <a
              href={`https://testnet.explorer.perawallet.app/application/${APP_ID}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 rounded-[8px] font-sans font-medium text-sm transition-all duration-200 flex items-center"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--bg-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--bg-border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              View Contract ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── PROTOCOL STATS ── */}
      <section className="relative py-12 px-4" style={{ borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
        <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedStat label="Credit Multiplier" value="2×–10×" />
          <AnimatedStat label="Min Stake" value="1" suffix="ALGO" />
          <AnimatedStat label="On-Chain" value="100" suffix="%" />
          <AnimatedStat label="Slash Protection" value="30" suffix="rounds" />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative py-20 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] mb-3">
              Built for Machine-to-Machine Finance
            </h2>
            <p className="font-sans text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Every feature designed for autonomous agents operating at machine speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon="◈"
              title="Stake & Lock"
              description="Lock ALGO as collateral. Your stake is your trust signal — higher stake unlocks higher credit limits."
              accentColor="var(--accent)"
            />
            <FeatureCard
              icon="↑"
              title="Build History"
              description="Record M2M payments on-chain. Each payment increases your credit score and unlocks more borrowing power."
              accentColor="var(--success)"
            />
            <FeatureCard
              icon="⟐"
              title="Draw Credit"
              description="Borrow ALGO against your reputation. Up to 10× your stake with perfect payment history."
              accentColor="var(--warning)"
            />
            <FeatureCard
              icon="↻"
              title="Repay & Grow"
              description="Repay outstanding credit to increase your limit further. The more you repay, the more you can borrow."
              accentColor="var(--accent)"
            />
            <FeatureCard
              icon="⚡"
              title="Instant Settlement"
              description="All operations settle in ~3.3 seconds on Algorand. No waiting, no intermediaries."
              accentColor="var(--success)"
            />
            <FeatureCard
              icon="✕"
              title="Trustless Slashing"
              description="Anyone can slash delinquent agents. No governance needed — the protocol enforces itself."
              accentColor="var(--danger)"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS + FORMULA ── */}
      <section className="relative py-20 px-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
        <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Steps */}
          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8">
              How It Works
            </h2>
            <Step
              number="01"
              title="Connect & Stake"
              description="Connect your Pera or Defly wallet. Stake a minimum of 1 ALGO to register as an agent."
            />
            <Step
              number="02"
              title="Build Reputation"
              description="Record machine-to-machine payments. Each payment boosts your credit score and increases your limit."
            />
            <Step
              number="03"
              title="Draw Credit"
              description="Borrow up to 10× your stake based on your reputation score. ALGO is sent directly to your wallet."
            />
            <Step
              number="04"
              title="Repay & Scale"
              description="Repay outstanding debt to unlock even higher credit limits. Your on-chain history is your credit file."
              isLast
            />
          </div>

          {/* Right: Formula */}
          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8">
              Credit Engine
            </h2>
            <FormulaCard />

            <div
              className="mt-4 card p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--danger-dim)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span className="text-sm" style={{ color: "var(--danger)" }}>⚠</span>
              </div>
              <div>
                <p className="text-xs font-sans font-semibold text-[var(--danger)] mb-0.5">Slash Protection</p>
                <p className="text-[12px] font-sans text-[var(--text-secondary)] leading-relaxed">
                  Agents with outstanding debt and no activity for 30+ rounds can be slashed by anyone. Stake is burned to the protocol treasury.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative py-20 px-4" style={{ borderTop: "1px solid var(--bg-border)" }}>
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            Ready to build credit?
          </h2>
          <p className="font-sans text-sm text-[var(--text-secondary)] mb-8">
            Connect your wallet, stake ALGO, and start building on-chain reputation in under a minute.
          </p>
          <button
            id="launch-app-cta"
            onClick={onLaunchApp}
            className="h-14 px-10 rounded-[8px] font-sans font-bold text-base text-white transition-all duration-200 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] active:scale-[0.98]"
            style={{ background: "var(--accent)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
          >
            Launch Protocol →
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            <span>ARC-4 Compliant</span>
            <span style={{ color: "var(--bg-border)" }}>|</span>
            <span>Open Source</span>
            <span style={{ color: "var(--bg-border)" }}>|</span>
            <span>Algorand Testnet</span>
          </div>
        </div>
      </section>
    </div>
  );
}
