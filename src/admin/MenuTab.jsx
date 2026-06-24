import React, { useState, useRef } from "react";
import { C, formatBRL, smallBtn } from "../theme.js";
import { uploadImage } from "../cloudinary.js";

const CATEGORIES = [
  { key: "massas", label: "Massas" },
  { key: "molhos", label: "Molhos" },
  { key: "adicionais", label: "Adicionais" },
];

export default function MenuTab({ menu, onMenuChange, showToast }) {
  const [activeCat, setActiveCat] = useState("massas");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", desc: "", price: "", photo: "" });
  const [adding, setAdding] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRefs = useRef({});

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({ name: item.name, desc: item.desc || "", price: String(item.price), photo: item.photo || "" });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    setDraft({ name: "", desc: "", price: "", photo: "" });
  };

  const cancel = () => {
    setEditingId(null);
    setAdding(false);
  };

  const save = () => {
    if (!draft.name.trim()) {
      showToast("Dê um nome ao item.");
      return;
    }
    const price = parseFloat(String(draft.price).replace(",", ".")) || 0;
    const list = menu[activeCat] || [];

    if (adding) {
      const newItem = { id: `${activeCat[0]}${Date.now()}`, name: draft.name, desc: draft.desc, price, photo: draft.photo || "" };
      onMenuChange({ ...menu, [activeCat]: [...list, newItem] });
      showToast("Item adicionado.");
    } else {
      const updated = list.map((it) =>
        it.id === editingId ? { ...it, name: draft.name, desc: draft.desc, price, photo: draft.photo || "" } : it
      );
      onMenuChange({ ...menu, [activeCat]: updated });
      showToast("Item atualizado.");
    }
    cancel();
  };

  const remove = (id) => {
    const updated = (menu[activeCat] || []).filter((it) => it.id !== id);
    onMenuChange({ ...menu, [activeCat]: updated });
    showToast("Item removido.");
    if (editingId === id) cancel();
  };

  // Upload directly on an existing item card (outside the edit form),
  // so you can change/remove the photo without entering edit mode.
  const handlePhotoSelect = async (item, file) => {
    if (!file) return;
    setUploadingId(item.id);
    try {
      const url = await uploadImage(file);
      const list = menu[activeCat] || [];
      const updated = list.map((it) => (it.id === item.id ? { ...it, photo: url } : it));
      onMenuChange({ ...menu, [activeCat]: updated });
      showToast("Foto atualizada.");
    } catch (e) {
      showToast("Erro ao enviar a foto. Tente novamente.");
    } finally {
      setUploadingId(null);
    }
  };

  const removePhoto = (item) => {
    const list = menu[activeCat] || [];
    const updated = list.map((it) => (it.id === item.id ? { ...it, photo: "" } : it));
    onMenuChange({ ...menu, [activeCat]: updated });
    showToast("Foto removida.");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${C.wine}33`,
    fontSize: 14,
    marginBottom: 8,
    boxSizing: "border-box",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCat(cat.key);
              cancel();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${C.wine}`,
              background: activeCat === cat.key ? C.wine : "transparent",
              color: activeCat === cat.key ? C.white : C.wine,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {(menu[activeCat] || []).map((item) => (
        <div key={item.id} style={{ background: C.white, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          {editingId === item.id ? (
            <EditForm draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} inputStyle={inputStyle} />
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.name}
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    background: "#eee",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  sem foto
                </div>
              )}

              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                  {item.desc && <div style={{ fontSize: 12, color: `${C.ink}88` }}>{item.desc}</div>}
                  <div style={{ fontSize: 13, color: C.wine, fontWeight: 600, marginTop: 2 }}>{formatBRL(item.price)}</div>
                </div>
              </div>
            </div>
          )}

          {editingId !== item.id && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputRefs.current[item.id] = el)}
                style={{ display: "none" }}
                onChange={(e) => handlePhotoSelect(item, e.target.files[0])}
              />
              <button
                onClick={() => fileInputRefs.current[item.id]?.click()}
                style={smallBtn(C.wine)}
                disabled={uploadingId === item.id}
              >
                {uploadingId === item.id ? "Enviando…" : item.photo ? "Trocar foto" : "Adicionar foto"}
              </button>
              {item.photo && (
                <button onClick={() => removePhoto(item)} style={smallBtn("#a87a2c")}>
                  Remover foto
                </button>
              )}
              <button onClick={() => startEdit(item)} style={smallBtn(C.wine)}>Editar</button>
              <button onClick={() => remove(item.id)} style={smallBtn("#a33")}>Remover item</button>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div style={{ background: C.white, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <EditForm draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} inputStyle={inputStyle} />
        </div>
      ) : (
        <button
          onClick={startAdd}
          style={{
            width: "100%",
            background: "transparent",
            border: `1.5px dashed ${C.wine}66`,
            color: C.wine,
            borderRadius: 10,
            padding: "14px 0",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            marginTop: 6,
          }}
        >
          + Adicionar item
        </button>
      )}
    </div>
  );
}

function EditForm({ draft, setDraft, onSave, onCancel, inputStyle }) {
  return (
    <div>
      <input
        style={inputStyle}
        placeholder="Nome do item"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
      />
      <input
        style={inputStyle}
        placeholder="Descrição (opcional)"
        value={draft.desc}
        onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
      />
      <input
        style={inputStyle}
        placeholder="Preço (ex: 32 ou 32,50). Use 0 se for incluso"
        value={draft.price}
        onChange={(e) => setDraft({ ...draft, price: e.target.value })}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={onSave} style={{ ...smallBtn(C.wine), flex: 1, padding: "10px 0" }}>Salvar</button>
        <button onClick={onCancel} style={{ ...smallBtn("#777"), flex: 1, padding: "10px 0" }}>Cancelar</button>
      </div>
    </div>
  );
    }
