import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

document.getElementById("backBtn").onclick = () => history.back();

async function loadOrder() {
  
  if (!orderId) return;
  
  const snap = await getDoc(doc(db, "orders", orderId));
  
  if (!snap.exists()) return;
  
  const order = snap.data();
  
  document.getElementById("restaurantName").textContent =
    order.restaurantName || "Restaurant";
  
  document.getElementById("orderNumber").textContent =
    order.orderNumber || orderId.slice(0, 8).toUpperCase();
  
  document.getElementById("statusBadge").textContent =
    order.status || "Pending";
  
  document.getElementById("deliveryAddress").textContent =
    order.address || "";
  
  const lat = Number(order.latitude);
  const lng = Number(order.longitude);
  
  const map = L.map("map").setView([lat, lng], 16);
  
  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap"
    }
  ).addTo(map);
  
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Delivery Address")
    .openPopup();
  
}

loadOrder();