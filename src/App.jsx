import React, { useState, useEffect, useCallback } from "react";
import { getConfigDoc, setConfigDoc, fetchOrders, createOrder, setOrderStatus, deleteOrder } from "./firebase.js";
import { C, serif, sans } from "./theme.js";
import ClientView from "./ClientView.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminView from "./AdminView.jsx";

const DEFAULT_MENU = {
  massas: [
    { id: "m1", name: "Tagliatelle", desc: "Massa fresca, fina e elegante", price: 32 },
    { id: "m2", name: "Fettuccine", desc: "Massa larga, textura macia", price: 32 },
    { id: "m3", name: "Penne", desc: "Tubinho clássico, prende bem o molho", price: 28 },
  ],
  molhos: [
    { id: "s1", name: "Sugo della Casa", desc: "Tomate, manjericão e azeite extra virgem", price: 0 },
    { id: "s2", name: "Quattro Formaggi", desc: "Mistura de quatro queijos italianos", price: 8 },
    { id: "s3", name: "Bolonhesa Artesanal", desc: "Carne moída lenta, vinho tinto e tomate", price: 10 },
    { id: "s4", name: "Branco com Manteiga e Sálvia", desc: "Manteiga clarificada, sálvia fresca", price: 9 },
  ],
  adicionais: [
    { id: "a1", name: "Queijo Parmesão Ralado", desc: "Na hora, fresquinho", price: 5 },
    { id: "a2", name: "Tomate Seco", desc: "Em tirinhas, levemente azedo", price: 6 },
    { id: "a3", name: "Frango Grelhado", desc: "Em cubos, temperado", price: 12 },
  ],
};

const DEFAULT_SETTINGS = {
  whatsapp: "5511999999999",
  adminPassword: "albarra2026",
  storeName: "Albarra Italian",
  tagline: "Macarrão Gourmet",
};

const DEFAULT_FORM_FIELDS = [
  { id: "name", label: "Nome", type: "text", placeholder: "Seu nome", required: true },
  { id: "address", label: "Endereço de entrega", type: "text", placeholder: "Rua, número, bairro", required: true },
  { id: "notes", label: "Observações", type: "textarea", placeholder: "Ex: sem cebola, troco para R$100…", required: false },
];

export default function App() {
  const [route, setRoute] = useState("client");
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [formFields, setFormFields] = useState(DEFAULT_FORM_FIELDS);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    (async () => {
      const [m, s, f, o] = await Promise.all([
        getConfigDoc("menu", DEFAULT_MENU),
        getConfigDoc("settings", DEFAULT_SETTINGS),
        getConfigDoc("formFields", { fields: DEFAULT_FORM_FIELDS }),
        fetchOrders(200),
      ]);
      setMenu(m);
      setSettings(s);
      setFormFields(f.fields || DEFAULT_FORM_FIELDS);
      setOrders(o);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash === "#admin") setRoute("admin-login");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const persistMenu = async (newMenu) => {
    setMenu(newMenu);
    await setConfigDoc("menu", newMenu);
  };

  const persistSettings = async (newSettings) => {
    setSettings(newSettings);
    await setConfigDoc("settings", newSettings);
  };

  const persistFormFields = async (newFields) => {
    setFormFields(newFields);
    await setConfigDoc("formFields", { fields: newFields });
  };

  const addOrder = async (order) => {
    const id = await createOrder(order);
    if (id) {
      setOrders((prev) => [{ id, ...order }, ...prev]);
    }
    return id;
  };

  const updateOrderStatus = async (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await setOrderStatus(orderId, status);
  };

  const removeOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await deleteOrder(orderId);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, fontFamily: sans, color: C.wine }}>
        Carregando…
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {route === "client" && (
        <ClientView
          menu={menu}
          settings={settings}
          formFields={formFields}
          cart={cart}
          setCart={setCart}
          onOrderPlaced={addOrder}
          showToast={showToast}
          goAdmin={() => setRoute("admin-login")}
        />
      )}
      {route === "admin-login" && (
        <AdminLogin
          settings={settings}
          onSuccess={() => setRoute("admin")}
          onBack={() => {
            window.location.hash = "";
            setRoute("client");
          }}
        />
      )}
      {route === "admin" && (
        <AdminView
          menu={menu}
          settings={settings}
          formFields={formFields}
          orders={orders}
          onMenuChange={persistMenu}
          onSettingsChange={persistSettings}
          onFormFieldsChange={persistFormFields}
          onOrderStatusChange={updateOrderStatus}
          onOrderDelete={removeOrder}
          onExit={() => {
            window.location.hash = "";
            setRoute("client");
          }}
          showToast={showToast}
        />
      )}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.white,
            padding: "12px 22px",
            borderRadius: 8,
            fontFamily: sans,
            fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 999,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
      }
