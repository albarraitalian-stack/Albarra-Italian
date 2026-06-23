import React, { useState } from "react";
import { C, smallBtn } from "../theme.js";

export default function SettingsTab({ settings, onSettingsChange, showToast }) {
  const [draft, setDraft] = useState(settings);

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${C.wine}33`,
    fontSize: 14,
    marginBottom: 14,
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: C.white, borderRadius: 10, padding: 18 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: C.wine }}>Nome da loja</label>
      <input style={inputStyle} value={draft.storeName} onChange={(e) => setDraft({ ...draft, storeName: e.target.value })} />

      <label style={{ fontSize: 12, fontWeight: 700, color: C.wine }}>Frase / tagline</label>
      <input style={inputStyle} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />

      <label style={{ fontSize: 12, fontWeight: 700, color: C.wine }}>WhatsApp (com DDI e DDD, só números, ex: 5511999999999)</label>
      <input style={inputStyle} value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} />

      <label style={{ fontSize: 12, fontWeight: 700, color: C.wine }}>Senha do painel</label>
      <input style={inputStyle} value={draft.adminPassword} onChange={(e) => setDraft({ ...draft, adminPassword: e.target.value })} />

      <button
        onClick={() => {
          onSettingsChange(draft);
          showToast("Configurações salvas.");
        }}
        style={{ ...smallBtn(C.wine), width: "100%", padding: "12px 0" }}
      >
        Salvar configurações
      </button>
    </div>
  );
}
