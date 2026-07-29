import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const backBtn = document.getElementById("backBtn");
const restaurantName = document.getElementById("restaurantName");
const orderNumber = document.getElementById("orderNumber");
const statusBadge = document.getElementById("statusBadge");
const deliveryAddress = document.getElementById("deliveryAddress");

backBtn.onclick = () => history.back();

async function loadOrder() {

  if (!orderId) {
    alert("Order not found");
    return;
  }

  try {

    const snap = await getDoc(doc(db, "orders", orderId));

    if (!snap.exists()) {
      alert("Order not found");
      return;
    }

    const order = snap.data();

    // معلومات الطلب
    restaurantName.textContent =
      order.restaurantName || "Restaurant";

    orderNumber.textContent =
      order.orderNumber ||
      orderId.slice(0, 8).toUpperCase();

    statusBadge.textContent =
      order.status || "Pending";

    deliveryAddress.innerHTML = `
      📍 ${order.address || ""}<br><br>

      🏢 Building: ${order.building || "-"}<br>

      🏠 Floor: ${order.floor || "-"}<br>

      📝 Note: ${order.note || "-"}
    `;

    // لون الحالة
    const status =
      (order.status || "pending").toLowerCase();

    if (status === "pending") {
      statusBadge.style.background = "#FFF3CD";
      statusBadge.style.color = "#B8860B";
    }

    if (status === "preparing") {
      statusBadge.style.background = "#E3F2FD";
      statusBadge.style.color = "#1565C0";
    }

    if (status === "on the way") {
      statusBadge.style.background = "#E8F5E9";
      statusBadge.style.color = "#2E7D32";
    }

    if (status === "delivered") {
      statusBadge.style.background = "#D4EDDA";
      statusBadge.style.color = "#198754";
    }

    // Timeline
    const steps = document.querySelectorAll(".step");

    steps.forEach(step =>
      step.classList.remove("active")
    );

    if (steps[0]) steps[0].classList.add("active");

    if (status === "preparing") {
      steps[1]?.classList.add("active");
    }

    if (status === "driver assigned") {
      steps[1]?.classList.add("active");
      steps[2]?.classList.add("active");
    }

    if (status === "on the way") {
      steps[1]?.classList.add("active");
      steps[2]?.classList.add("active");
      steps[3]?.classList.add("active");
    }

    if (status === "delivered") {
      steps.forEach(step =>
        step.classList.add("active")
      );
    }

    // الإحداثيات
    const lat = Number(order.latitude);
    const lng = Number(order.longitude);

    if (!lat || !lng) return;

    // إنشاء الخريطة
    const map = L.map("map").setView([lat, lng], 16);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap"
      }
    ).addTo(map);

    // أيقونة المنزل
    const customerIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/25/25694.png",
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    // أيقونة السائق
    const driverIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
      iconSize: [42, 42],
      iconAnchor: [21, 42]
    });

    // منزل الزبون
    L.marker([lat, lng], {
      icon: customerIcon
    })
      .addTo(map)
      .bindPopup("Delivery Address")
      .openPopup();

    // السائق (مؤقت)
    L.marker(
      [lat + 0.002, lng - 0.002],
      {
        icon: driverIcon
      }
    ).addTo(map);

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

}

loadOrder();