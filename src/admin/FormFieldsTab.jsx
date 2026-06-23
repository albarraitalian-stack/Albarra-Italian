import React, { useState } from "react";
import { C, smallBtn } from "../theme.js";

const TYPE_LABELS = {
  text: "Texto curto",
  textarea: "Texto longo",
  number: "Número",
};

function newFieldId() {
  return `field_${Date.now()}`;
}

export default function FormFieldsTab({ formFields, onFormFieldsChange, showToast }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [adding, setAdding] = useState(false);

  function emptyDraft() {
    return { label: "", type: "text", placeholder: "", required: true };
  }

  const startEdit = (field) => {
    setEditingId(field.id);
    setDraft({ label: field.label, type: field.type, placeholder: field.placeholder || "", required: !!field.required });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const cancel = () => {
    setEditingId(null);
    setAdding(false);
  };

  const save = () => {
    if (!draft.label.trim()) {
      showToast("Dê um nome ao campo.");
      return;
    }
    if (adding) {
      const newField = { id: newFieldId(), ...draft };
      onFormFieldsChange([...formFields, newField]);
      showToast("Campo adicionado.");
    } else {
      const updated = formFields.map((f) => (f.id === editingId ? { ...f, ...draft } : f));
      onFormFieldsChange(updated);
      showToast("Campo atualizado.");
    }
    cancel();
  };

  const remove = (id) => {
    if (formFields.length <= 1) {
      showToast("É preciso manter pelo menos um campo.");
      return;
    }
    onFormFieldsChange(formFields.filter((f) => f.id !== id));
    showToast("Campo removido.");
    if (editingId === id) cancel();
  };

  const move = (id, direction) => {
    const idx = formFields.findIndex((f) => f.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= formFields.length) return;
    const updated = [...formFields];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    onFormFieldsChange(updated);
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
      <p style={{ fontSize: 13, color: `${C.ink}99`, marginTop: 0 }}>
        Estes são os campos que o cliente preenche antes de enviar o pedido pelo WhatsApp. Você pode adicionar
        campos como CEP, cidade, ponto de referência, etc.
      </p>

      {formFields.map((field, idx) => (
        <div key={field.id} style={{ background: C.white, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          {editingId === field.id ? (
            <EditForm draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} inputStyle={inputStyle} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {field.label}
                  {field.required && <span style={{ color: C.wine, fontSize: 12, fontWeight: 700 }}> *</span>}
                </div>
                <div style={{ fontSize: 12, color: `${C.ink}88` }}>
                  {TYPE_LABELS[field.type] || field.type}
                  {field.placeholder ? ` · "${field.placeholder}"` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => move(field.id, -1)} disabled={idx === 0} style={arrowBtnStyle(idx === 0)}>↑</button>
                <button onClick={() => move(field.id, 1)} disabled={idx === formFields.length - 1} style={arrowBtnStyle(idx === formFields.length - 1)}>↓</button>
                <button onClick={() => startEdit(field)} style={smallBtn(C.wine)}>Editar</button>
                <button onClick={() => remove(field.id)} style={smallBtn("#a33")}>Remover</button>
              </div>
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
          + Adicionar campo
        </button>
      )}
    </div>
  );
}

function arrowBtnStyle(disabled) {
  return {
    background: "transparent",
    border: `1px solid ${C.wine}33`,
    color: disabled ? `${C.wine}33` : C.wine,
    borderRadius: 6,
    width: 28,
    height: 28,
    fontSize: 13,
    cursor: disabled ? "default" : "pointer",
  };
}

function EditForm({ draft, setDraft, onSave, onCancel, inputStyle }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.wine }}>Nome do campo</label>
      <input
        style={inputStyle}
        placeholder="Ex: CEP, Cidade, Ponto de referência"
        value={draft.label}
        onChange={(e) => setDraft({ ...draft, label: e.target.value })}
      />

      <label style={{ fontSize: 12, fontWeight: 600, color: C.wine }}>Tipo de campo</label>
      <select
        style={inputStyle}
        value={draft.type}
        onChange={(e) => setDraft({ ...draft, type: e.target.value })}
      >
        <option value="text">Texto curto</option>
        <option value="textarea">Texto longo (área maior)</option>
        <option value="number">Número</option>
      </select>

      <label style={{ fontSize: 12, fontWeight: 600, color: C.wine }}>Texto de exemplo (opcional)</label>
      <input
        style={inputStyle}
        placeholder="Ex: 01310-100"
        value={draft.placeholder}
        onChange={(e) => setDraft({ ...draft, placeholder: e.target.value })}
      />

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={draft.required}
          onChange={(e) => setDraft({ ...draft, required: e.target.checked })}
        />
        Campo obrigatório
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={onSave} style={{ ...smallBtn(C.wine), flex: 1, padding: "10px 0" }}>Salvar</button>
        <button onClick={onCancel} style={{ ...smallBtn("#777"), flex: 1, padding: "10px 0" }}>Cancelar</button>
      </div>
    </div>
  );
}
