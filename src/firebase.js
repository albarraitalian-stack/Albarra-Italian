import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNiT5Dav2SXcPtZW5yr1IBC9gsYvEVloc",
  authDomain: "albarra-italian.firebaseapp.com",
  projectId: "albarra-italian",
  storageBucket: "albarra-italian.firebasestorage.app",
  messagingSenderId: "932679525720",
  appId: "1:932679525720:web:1827f2c16b04b2007bb12d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---------- Document-based config (menu, settings, form fields) ----------

export async function getConfigDoc(name, fallback) {
  try {
    const ref = doc(db, "config", name);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, fallback);
      return fallback;
    }
    return snap.data();
  } catch (e) {
    console.error("getConfigDoc failed", name, e);
    return fallback;
  }
}

export async function setConfigDoc(name, value) {
  try {
    const ref = doc(db, "config", name);
    await setDoc(ref, value);
    return true;
  } catch (e) {
    console.error("setConfigDoc failed", name, e);
    return false;
  }
}

// ---------- Orders collection ----------

export async function fetchOrders(max = 200) {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAtTs", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("fetchOrders failed", e);
    return [];
  }
}

export async function createOrder(order) {
  try {
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      createdAtTs: Date.now(),
    });
    return ref.id;
  } catch (e) {
    console.error("createOrder failed", e);
    return null;
  }
}

export async function setOrderStatus(orderId, status) {
  try {
    await updateDoc(doc(db, "orders", orderId), { status });
    return true;
  } catch (e) {
    console.error("setOrderStatus failed", e);
    return false;
  }
}

export async function deleteOrder(orderId) {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (e) {
    console.error("deleteOrder failed", e);
    return false;
  }
}
