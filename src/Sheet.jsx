import React from "react";
import { C, serif, sans } from "./theme.js";

export default function Sheet({ children, onClose, title }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,8,10,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.cream,
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: "20px 20px 0 0",
          padding: "22px 20px 28px",
          fontFamily: sans,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: serif, fontSize: 20, color: C.ink, margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, color: C.ink, cursor: "pointer" }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
