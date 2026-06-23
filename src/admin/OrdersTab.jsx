import React from "react";
import { C, serif, formatBRL } from "../theme.js";

export default function OrdersTab({ orders, onStatusChange, formFields }) {
  if (orders.length === 0) {
    return <p style={{ color: `${C.ink}88`, textAlign: "center", marginTop: 40 }}>Nenhum pedido recebido ainda.</p>;
  }

  const statusColor = { novo: C.wine, preparando: "#a87a2c", entregue: "#3d6b3d" };

  const titleFieldId = formFields.find((f) => f.id === "name")?.id || formFields[0]?.id;

  return (
    <div>
      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: C.white,
            borderRadius: 10,
            padding: 16,
            marginBottom: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {o.customer?.[titleFieldId] || "Cliente"}
              </div>
              <div style={{ fontSize: 11, color: `${C.ink}55`, marginTop: 2 }}>
                {o.createdAt ? new Date(o.createdAt).toLocaleString("pt-BR") : ""}
              </div>
            </div>
            <span
              style={{
                background: `${statusColor[o.status] || C.wine}18`,
                color: statusColor[o.status] || C.wine,
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 12,
                textTransform: "uppercase",
              }}
            >
              {o.status}
            </span>
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: `${C.ink}99` }}>
            {formFields
              .filter((f) => f.id !== titleFieldId && o.customer?.[f.id])
              .map((f) => (
                <div key={f.id}>
                  <strong>{f.label}:</strong> {o.customer[f.id]}
                </div>
              ))}
          </div>

          <div style={{ marginTop: 10, fontSize: 13, borderTop: `1px solid ${C.wine}14`, paddingTop: 8 }}>
            {o.items.map((it, idx) => (
              <div key={it.id || idx}>
                {it.qty}x {it.name}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontWeight: 700, fontFamily: serif }}>{formatBRL(o.total)}</span>
            <select
              value={o.status}
              onChange={(e) => onStatusChange(o.id, e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.wine}33`, fontSize: 12 }}
            >
              <option value="novo">Novo</option>
              <option value="preparando">Preparando</option>
              <option value="entregue">Entregue</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
