import React, { useState } from "react";
import { C, serif, sans } from "./theme.js";

export default function AdminLogin({ settings, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    if (password === settings.adminPassword) onSuccess();
    else setError("Senha incorreta.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.wineDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sans,
        padding: 20,
      }}
    >
      <div style={{ background: C.cream, borderRadius: 14, padding: "32px 28px", width: "100%", maxWidth: 360 }}>
        <h2 style={{ fontFamily: serif, color: C.ink, textAlign: "center", marginTop: 0 }}>Painel Albarra</h2>
        <p style={{ fontSize: 13, color: `${C.ink}99`, textAlign: "center", marginTop: -6 }}>
          Acesso restrito ao administrador
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: `1px solid ${C.wine}44`,
            fontSize: 14,
            marginBottom: 10,
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") tryLogin();
          }}
        />
        {error && <p style={{ color: C.wine, fontSize: 13, marginTop: 0 }}>{error}</p>}
        <button
          onClick={tryLogin}
          style={{
            width: "100%",
            background: C.wine,
            color: C.white,
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          Entrar
        </button>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            color: `${C.ink}88`,
            marginTop: 14,
            fontSize: 13,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          ← Voltar ao cardápio
        </button>
      </div>
    </div>
  );
}
