export const C = {
  wine: "#6b1420",
  wineDark: "#4a0d16",
  wineDeep: "#3a0a11",
  cream: "#faf6ef",
  white: "#ffffff",
  ink: "#241010",
  gold: "#cf9f4e",
};

export const serif = "'Georgia', 'Times New Roman', serif";
export const sans = "'Helvetica Neue', Arial, sans-serif";

export function formatBRL(n) {
  return Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function smallBtn(color) {
  return {
    background: color,
    color: C.white,
    border: "none",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  };
}

export const qtyBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: `1px solid ${C.wine}`,
  background: C.white,
  color: C.wine,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};
