import React, { useState, useEffect, useCallback } from "react";
import { getConfigDoc, setConfigDoc, fetchOrders, createOrder, setOrderStatus } from "./firebase.js";
import { C, serif, sans } from "./theme.js";
import ClientView from "./ClientView.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminView from "./AdminView.jsx";

const DEFAULT_MENU = {
  massas: [
    { id: "m1", name: "Tagliatelle", desc: "Massa fresca, fina e elegante", price: 32 },
    { id: "m2", name: "Fettuccine", desc: "Massa larga, textura macia", price: 32 },
    { id: "m3", name: "Penne", desc: "Tubinho clássico, prende bem o molho", price: 28 }
