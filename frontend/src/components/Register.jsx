/**
 * Register.jsx — Agent registration & staking interface.
 *
 * Premium 3-stage flow:
 *   1. Connect wallet (if no address)
 *   2. Stake + register (if connected but not registered)
 *   3. Success flash (brief, then auto-transitions)
 */

import React, { useState } from "react";
import { useWallet } from "../context/WalletContext.jsx";
import { useContract } from "../context/ContractContext.jsx";
import { useToast } from "./ui/Toast.jsx";
import Button from "./ui/Button.jsx";
import Input from "./ui/Input.jsx";
import { fmtAlgo, fmtAddress } from "../utils/format.js";

function WalletIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="12" width="36" height="24" rx="5" stroke="var(--accent)" strokeWidth="2" fill="none"/>
      <rect x="28" y="20" width="14" height="8" rx="3" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="1.5"/>
      <circle cx="35" cy="24" r="2" fill="var(--accent)"/>
    </svg>
  );
}

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Opt-in" },
    { num: 2, label: "Stake" },
    { num: 3, label: "Active" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 my-6">
      {steps.map((step, i) => {
        const isCompleted = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        return (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all duration-300"
                style={{
                  background: isCompleted || isCurrent ? "var(--accent)" : "var(--bg-elevated)",
                  color: isCompleted || isCurrent ? "var(--text-primary)" : "var(--text-muted)",
                  border: `1px solid ${isCompleted || isCurrent ? "var(--accent)" : "var(--bg-border)"}`,
                  boxShadow: isCurrent ? "0 0 12px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {isCompleted ? "✓" : step.num}
              </div>
              <span
                className="text-[10px] font-sans font-medium"
                style={{ color: isCurrent ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-16 h-px mx-2 mb-5"
                style={{ background: isCompleted ? "var(--accent)" : "var(--bg-border)" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Register() {
  const { address, connectPera, connectDefly } = useWallet();
  const { callRegister, loading, isOptedIn } = useContract();
  const { addToast } = useToast();
  const [stakeInput, setStakeInput] = useState("1");
  const [txStatus, setTxStatus] = useState("idle"); // idle | signing | submitting | confirming | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const stakeValue = parseFloat(stakeInput) || 0;
  const isValid = stakeValue >= 1;
  const initialCredit = (stakeValue * 2).toFixed(6);
  const maxCredit = (stakeValue * 10).toFixed(6);

  const handleRegister = async () => {
    if (!isValid) return;
    setTxStatus("signing");
    setErrorMsg("");
    try {
      setTxStatus("submitting");
      await callRegister(stakeInput);
      setTxStatus("success");
      addToast(`✓ Agent registered — Initial credit: ${initialCredit} ALGO`, "success", 5000);
    } catch (err) {
      setTxStatus("error");
      setErrorMsg(err.message);
      addToast(err.message, "error");
    }
  };

  const getButtonText = () => {
    switch (txStatus) {
      case "signing": return "Signing in wallet...";
      case "submitting": return "Submitting to chain...";
      case "confirming": return "Confirming...";
      default: return "Register Agent";
    }
  };

  const currentStep = !address ? 1 : txStatus === "success" ? 3 : 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-4 animate-fade-in">
      {/* Hero text */}
      <div className="text-center mb-10 max-w-xl">
        <h1 className="font-display font-extrabold text-4xl md:text-[56px] leading-[1.05] mb-5">
          <span className="text-[var(--text-primary)]">Credit for</span>
          <br />
          <span
            className="bg-gradient-to-r from-[var(--accent)] via-[#818cf8] to-[var(--accent)] bg-clip-text"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            Autonomous Agents.
          </span>
        </h1>
        <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-md mx-auto">
          Stake ALGO. Build history. Draw undercollateralised credit.
          <br />
          No human required.
        </p>
      </div>

      {/* Registration card */}
      <div
        className="card w-full max-w-[440px] p-8 transition-all duration-500"
        style={{
          borderColor: txStatus === "success" ? "var(--success)" : undefined,
          boxShadow: txStatus === "success"
            ? "0 0 20px rgba(34,197,94,0.15), 0 0 0 1px var(--success), 0 4px 24px rgba(0,0,0,0.4)"
            : undefined,
        }}
      >
        {/* Stage 1: Connect wallet */}
        {!address && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-5 opacity-80">
              <WalletIcon />
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
              Connect your wallet
            </h2>
            <p className="text-sm font-sans text-[var(--text-secondary)] mb-8">
              Pera or Defly Wallet required
            </p>
            <div className="w-full flex flex-col gap-2.5">
              <Button
                id="register-connect-pera"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={connectPera}
              >
                Connect Pera Wallet
              </Button>
              <Button
                id="register-connect-defly"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={connectDefly}
              >
                Connect Defly Wallet
              </Button>
            </div>
          </div>
        )}

        {/* Stage 2: Stake form */}
        {address && txStatus !== "success" && (
          <div className="flex flex-col gap-5">
            {/* Connected address */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[8px]"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--success)] pulse-dot" />
              <span className="font-mono text-xs text-[var(--text-primary)] truncate">
                {fmtAddress(address, 6, 6)}
              </span>
              {isOptedIn && (
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] text-[var(--success)]"
                  style={{ background: "var(--success-dim)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  OPTED IN
                </span>
              )}
            </div>

            <Input
              id="stake-input"
              type="number"
              label="Stake Amount"
              hint="MIN 1.000000 ALGO"
              suffix="ALGO"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              placeholder="1.000000"
              error={!isValid && stakeInput !== "" ? "Minimum stake is 1 ALGO" : ""}
            />

            {/* Live credit preview */}
            <div
              className="rounded-[8px] p-4 space-y-2.5"
              style={{
                background: "var(--accent-dim)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[var(--text-secondary)]">Initial credit limit</span>
                <span className="num text-sm font-semibold text-[var(--text-primary)]">{initialCredit} ALGO</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[var(--text-secondary)]">Max credit limit</span>
                <span className="num text-sm font-semibold text-[var(--text-primary)]">{maxCredit} ALGO</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[var(--text-secondary)]">Credit multiplier</span>
                <span className="num text-sm font-bold text-[var(--accent)]">2× → 10×</span>
              </div>
            </div>

            <StepIndicator currentStep={currentStep} />

            <Button
              id="register-button"
              variant="primary"
              size="lg"
              className="w-full"
              loading={txStatus === "signing" || txStatus === "submitting" || txStatus === "confirming" || loading}
              disabled={!isValid}
              onClick={handleRegister}
            >
              {loading || txStatus !== "idle" ? getButtonText() : "Register Agent"}
            </Button>

            {/* Error */}
            {errorMsg && (
              <div
                className="rounded-[8px] px-4 py-3 text-sm font-sans flex items-start gap-2.5"
                style={{
                  background: "var(--danger-dim)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "var(--danger)",
                }}
              >
                <span className="mt-0.5 shrink-0">✕</span>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Stage 3: Success */}
        {txStatus === "success" && (
          <div className="flex flex-col items-center text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{
                background: "var(--success-dim)",
                border: "2px solid rgba(34,197,94,0.3)",
                boxShadow: "0 0 20px rgba(34,197,94,0.15)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--success)] mb-2">
              Agent Registered
            </h2>
            <p className="text-sm font-sans text-[var(--text-secondary)] mb-1">
              Initial credit limit
            </p>
            <p className="num text-2xl font-bold text-[var(--text-primary)]">
              {initialCredit} ALGO
            </p>
          </div>
        )}
      </div>

      {/* Info cards below registration */}
      {!address && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-12 max-w-[640px] w-full">
          {[
            { icon: "◈", title: "Stake & Lock", desc: "Lock ALGO as collateral to build trust." },
            { icon: "↑", title: "Build History", desc: "Record payments to grow your score." },
            { icon: "⟐", title: "Draw Credit", desc: "Borrow up to 10× your stake." },
          ].map((f) => (
            <div key={f.title} className="card p-4 text-center group hover:border-[var(--accent)] transition-all duration-300">
              <span className="text-lg mb-2 block" style={{ color: "var(--accent)" }}>{f.icon}</span>
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mb-1">{f.title}</h3>
              <p className="text-[12px] font-sans text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
