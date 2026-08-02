import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================
// GET ORDER ID
// ======================

const params = new URLSearchParams(window.location.search);

let orderId = params.get("id");

if (!orderId) {
  orderId = localStorage.getItem("lastOrderId");
}

// ======================
// ELEMENTS
// ======================

const backBtn = document.getElementById("backBtn");

const restaurantName = document.getElementById("restaurantName");
const orderNumber = document.getElementById("orderNumber");
const statusBadge = document.getElementById("orderStatus");

const deliveryAddress = document.getElementById("address");

const itemsContainer = document.getElementById("itemsContainer");
const paymentMethod = document.getElementById("paymentMethod");

const subtotal = document.getElementById("subtotal");
const deliveryFee = document.getElementById("deliveryFee");
const serviceFee = document.getElementById("serviceFee");
const totalPrice = document.getElementById("totalPrice");

backBtn.onclick = () => history.back();

// ======================
// LOAD ORDER
// ======================

async function loadOrder() {

  if (!orderId) {
    alert("Order ID not found");
    return;
  }

  try {

    const snap = await getDoc(doc(db, "orders", orderId));

    if (!snap.exists()) {
      alert("Order not found");
      return;
    }

    const order = snap.data();

    // Restaurant
    restaurantName.textContent =
      order.restaurantName || "Restaurant";

    orderNumber.textContent =
      "#" + orderId.substring(0, 8).toUpperCase();

    statusBadge.textContent =
      order.status || "Pending";

    // Address
    deliveryAddress.innerHTML = `
📍 ${order.address || ""}<br><br>
🏢 Building: ${order.building || "-"}<br>
🏠 Floor: ${order.floor || "-"}<br>
📝 Note: ${order.note || "-"}
`;

    // Items
    itemsContainer.innerHTML = "";

    if (order.items) {

      order.items.forEach(item => {

        itemsContainer.innerHTML += `
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;">

<div>

<strong>${item.quantity} × ${item.name}</strong>

</div>

<div>

${(item.price * item.quantity).toFixed(2)} DH

</div>

</div>
`;

      });

    }

    // Payment
    paymentMethod.textContent =
      order.paymentMethod || "Cash";

    // Prices
    subtotal.textContent =
      (order.subtotal || 0).toFixed(2) + " DH";

    deliveryFee.textContent =
      (order.deliveryFee || 0).toFixed(2) + " DH";

    serviceFee.textContent =
      (order.serviceFee || 0).toFixed(2) + " DH";

    totalPrice.textContent =
      (order.total || 0).toFixed(2) + " DH";

    // Status color
    const status = (order.status || "").toLowerCase();

    if (status === "pending") {
      statusBadge.style.background = "#FFF3CD";
      statusBadge.style.color = "#B8860B";
    }

    if (status === "preparing") {
      statusBadge.style.background = "#E3F2FD";
      statusBadge.style.color = "#1565C0";
    }

    if (status === "driver assigned") {
      statusBadge.style.background = "#E8F5E9";
      statusBadge.style.color = "#2E7D32";
    }

    if (status === "on the way") {
      statusBadge.style.background = "#D1ECF1";
      statusBadge.style.color = "#0C5460";
    }

    if (status === "delivered") {
      statusBadge.style.background = "#D4EDDA";
      statusBadge.style.color = "#155724";
    }

  } catch (err) {

    console.error(err);
    alert(err.message);

  }

}

loadOrder();
