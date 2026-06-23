import React, { useState } from "react";
import { C, serif, sans } from "./theme.js";
import OrdersTab from "./admin/OrdersTab.jsx";
import MenuTab from "./admin/MenuTab.jsx";
import FormFieldsTab from "./admin/FormFieldsTab.jsx";
import SettingsTab from "./admin/SettingsTab.jsx";

export default function AdminView({
  menu,
  settings,
  formFields,
  orders,
  onMenuChange,
  onSettingsChange,
  onFormFieldsChange,
  onOrderStatusChange,
  onExit,
  showToast,
}) {
  const [tab, setTab] = useState("orders");

  return (
    <div style={{ background: "#f5f1e8", minHeight: "100vh", fontFamily: sans, color: C.ink }}>
      <header style={{ background: C.wine, padding: "20px 20px 0", color: C.white }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>Painel · {settings.storeName}</h1>
          <button
            onClick={onExit}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: C.white, borderRadius: 6, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
          >
            Ver cardápio
          </button>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { key: "orders", label: `Pedidos (${orders.length})` },
            { key: "menu", label: "Cardápio" },
            { key: "form", label: "Formulário" },
            { key: "settings", label: "Configurações" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? C.cream : "transparent",
                color: tab === t.key ? C.wine : "rgba(255,255,255,0.75)",
                border: "none",
                borderRadius: "8px 8px 0 0",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 18px 60px" }}>
        {tab === "orders" && <OrdersTab orders={orders} onStatusChange={onOrderStatusChange} formFields={formFields} />}
        {tab === "menu" && <MenuTab menu={menu} onMenuChange={onMenuChange} showToast={showToast} />}
        {tab === "form" && <FormFieldsTab formFields={formFields} onFormFieldsChange={onFormFieldsChange} showToast={showToast} />}
        {tab === "settings" && <SettingsTab settings={settings} onSettingsChange={onSettingsChange} showToast={showToast} />}
      </main>
    </div>
  );
}
