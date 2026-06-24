import React, { useState } from "react";
import { C, serif, sans, formatBRL, qtyBtnStyle } from "./theme.js";
import Sheet from "./Sheet.jsx";

export default function ClientView({ menu, settings, formFields, cart, setCart, onOrderPlaced, showToast, goAdmin }) {
  const [activeCategory, setActiveCategory] = useState("massas");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [zoomPhoto, setZoomPhoto] = useState(null);

  const categories = [
    { key: "massas", label: "Massas" },
    { key: "molhos", label: "Molhos" },
    { key: "adicionais", label: "Adicionais" },
  ];

  const addToCart = (item, category) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, category, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const itemCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: sans, color: C.ink, paddingBottom: cart.length ? 90 : 0 }}>
      <header
        style={{
          background: `linear-gradient(160deg, ${C.wine}, ${C.wineDark})`,
          padding: "44px 20px 36px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ width: 64, height: 2, background: "rgba(255,255,255,0.55)", margin: "0 auto 14px" }} />
        <h1
          style={{
            color: C.white,
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 3,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {settings.storeName}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 15,
            letterSpacing: 1,
            margin: "8px 0 0",
          }}
        >
          {settings.tagline}
        </p>
        <div style={{ width: 64, height: 2, background: "rgba(255,255,255,0.55)", margin: "14px auto 0" }} />
        <button
          onClick={goAdmin}
          aria-label="Acesso administrativo"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "rgba(255,255,255,0.6)",
            borderRadius: 6,
            width: 30,
            height: 30,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ⚙
        </button>
      </header>

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          padding: "18px 16px 6px",
          position: "sticky",
          top: 0,
          background: C.cream,
          zIndex: 10,
          borderBottom: `1px solid ${C.wine}22`,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              padding: "10px 18px",
              borderRadius: 24,
              border: `1px solid ${C.wine}`,
              background: activeCategory === cat.key ? C.wine : "transparent",
              color: activeCategory === cat.key ? C.white : C.wine,
              fontFamily: sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 40px" }}>
        {(menu[activeCategory] || []).length === 0 && (
          <p style={{ textAlign: "center", color: `${C.ink}88`, marginTop: 40, fontSize: 14 }}>
            Nenhum item nesta categoria ainda.
          </p>
        )}
        {(menu[activeCategory] || []).map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 14,
                padding: "16px 0",
                borderBottom: `1px solid ${C.wine}18`,
                alignItems: "center",
              }}
            >
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.name}
                  onClick={() => setZoomPhoto({ url: item.photo, name: item.name })}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    objectFit: "cover",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
              )}
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 17, color: C.ink }}>{item.name}</div>
                  {item.desc && <div style={{ fontSize: 13, color: `${C.ink}99`, marginTop: 3 }}>{item.desc}</div>}
                  <div style={{ fontFamily: serif, fontSize: 14, color: C.wine, marginTop: 6, fontWeight: 600 }}>
                    {item.price > 0 ? `+ ${formatBRL(item.price)}` : "Incluso"}
                  </div>
                </div>
                {inCart ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={qtyBtnStyle}>–</button>
                    <span style={{ minWidth: 18, textAlign: "center", fontWeight: 700 }}>{inCart.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={qtyBtnStyle}>+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item, activeCategory)}
                    style={{
                      background: C.wine,
                      color: C.white,
                      border: "none",
                      borderRadius: 20,
                      padding: "9px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Adicionar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,4,5,0.92)",
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setZoomPhoto(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: C.white,
              width: 36,
              height: 36,
              borderRadius: "50%",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <img
            src={zoomPhoto.url}
            alt={zoomPhoto.name}
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 12, objectFit: "contain" }}
          />
        </div>
      )}

      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: C.wine,
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -6px 20px rgba(0,0,0,0.15)",
            cursor: "pointer",
            zIndex: 20,
          }}
          onClick={() => setCartOpen(true)}
        >
          <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>
            {itemCount} {itemCount === 1 ? "item" : "itens"} · {formatBRL(total)}
          </span>
          <span style={{ color: C.white, fontWeight: 700, fontSize: 14, textDecoration: "underline" }}>
            Ver pedido
          </span>
        </div>
      )}

      {cartOpen && (
        <CartSheet
          cart={cart}
          updateQty={updateQty}
          total={total}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}

      {checkoutOpen && (
        <CheckoutSheet
          cart={cart}
          total={total}
          settings={settings}
          formFields={formFields}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={(customerData) => {
            const order = {
              createdAt: new Date().toISOString(),
              customer: customerData,
              items: cart,
              total,
              status: "novo",
            };
            onOrderPlaced(order);

            const lines = cart
              .map((c) => `• ${c.qty}x ${c.name}${c.price > 0 ? ` (+${formatBRL(c.price)})` : ""}`)
              .join("\n");

            const customerLines = formFields
              .map((f) => {
                const val = customerData[f.id];
                if (!val) return null;
                return `${f.label}: ${val}`;
              })
              .filter(Boolean)
              .join("\n");

            const msg =
              `Olá! Quero fazer um pedido na ${settings.storeName} 🇮🇹\n\n` +
              `${lines}\n\n` +
              `Total: ${formatBRL(total)}\n\n` +
              `${customerLines}\n`;

            const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");

            setCheckoutOpen(false);
            setCart([]);
            showToast("Pedido enviado! Abrindo WhatsApp…");
          }}
        />
      )}
    </div>
  );
}

function CartSheet({ cart, updateQty, total, onClose, onCheckout }) {
  return (
    <Sheet title="Seu pedido" onClose={onClose}>
      {cart.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: `1px solid ${C.wine}18`,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
            <div style={{ fontSize: 13, color: `${C.ink}88` }}>{formatBRL(c.price)} cada</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => updateQty(c.id, -1)} style={qtyBtnStyle}>–</button>
            <span style={{ minWidth: 18, textAlign: "center", fontWeight: 700 }}>{c.qty}</span>
            <button onClick={() => updateQty(c.id, 1)} style={qtyBtnStyle}>+</button>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0 6px", fontFamily: serif, fontSize: 18, fontWeight: 700 }}>
        <span>Total</span>
        <span>{formatBRL(total)}</span>
      </div>
      <button
        onClick={onCheckout}
        style={{
          width: "100%",
          background: C.wine,
          color: C.white,
          border: "none",
          borderRadius: 10,
          padding: "14px 0",
          fontSize: 15,
          fontWeight: 700,
          marginTop: 12,
          cursor: "pointer",
        }}
      >
        Continuar pedido
      </button>
    </Sheet>
  );
}

function CheckoutSheet({ cart, total, settings, formFields, onClose, onConfirm }) {
  const initialValues = {};
  formFields.forEach((f) => (initialValues[f.id] = ""));
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${C.wine}44`,
    fontSize: 14,
    fontFamily: sans,
    marginBottom: 12,
    boxSizing: "border-box",
    background: C.white,
    color: C.ink,
  };

  const handleSubmit = () => {
    for (const f of formFields) {
      if (f.required && !String(values[f.id] || "").trim()) {
        setError(`Preencha o campo "${f.label}" para continuar.`);
        return;
      }
    }
    onConfirm(values);
  };

  return (
    <Sheet title="Finalizar pedido" onClose={onClose}>
      <p style={{ fontSize: 13, color: `${C.ink}99`, marginTop: 0 }}>
        Confirme seus dados. O pedido será enviado pelo WhatsApp para a {settings.storeName}.
      </p>

      {formFields.map((f) => (
        <div key={f.id}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.wine }}>
            {f.label}
            {f.required ? "" : " (opcional)"}
          </label>
          {f.type === "textarea" ? (
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
              value={values[f.id] || ""}
              onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
              placeholder={f.placeholder}
            />
          ) : (
            <input
              type={f.type === "number" ? "number" : "text"}
              style={inputStyle}
              value={values[f.id] || ""}
              onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}

      {error && <p style={{ color: C.wine, fontSize: 13 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 6px", fontFamily: serif, fontSize: 17, fontWeight: 700 }}>
        <span>Total</span>
        <span>{formatBRL(total)}</span>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          background: C.wine,
          color: C.white,
          border: "none",
          borderRadius: 10,
          padding: "14px 0",
          fontSize: 15,
          fontWeight: 700,
          marginTop: 8,
          cursor: "pointer",
        }}
      >
        Enviar pedido pelo WhatsApp
      </button>
    </Sheet>
  );
        }
