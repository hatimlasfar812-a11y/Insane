import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ordersContainer =
  document.getElementById("ordersContainer");

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    
    location.href = "login.html";
    return;
    
  }
  
 const q = query(
  collection(db, "orders"),
  where("uid", "==", user.uid)
);

let snapshot;

try {
  
  snapshot = await getDocs(q);
  
  console.log("User UID:", user.uid);
  console.log("Orders found:", snapshot.size);
  
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
  
} catch (err) {
  
  console.error(err);
  return;
  
}
console.log("Orders found:", snapshot.size);
  alert("Orders found: " + snapshot.size);
  ordersContainer.innerHTML = "";
  
  if (snapshot.empty) {
    
    ordersContainer.innerHTML = `

<div class="empty">

<h2>No Orders Yet</h2>

<p>Your orders will appear here.</p>

</div>

`;
    
    return;
    
  }
  
snapshot.forEach((doc) => {
  
  const order = doc.data();
  
  ordersContainer.innerHTML += `
    <div class="order-card" data-id="${doc.id}">
      <h2>${order.restaurantName || "Restaurant"}</h2>
      <p>Total: ${order.total.toFixed(2)} DH</p>
      <p>Status: ${order.status}</p>
    </div>
  `;
  
});
  
  document.querySelectorAll(".order-card")
    .forEach(card => {
      
      card.onclick = () => {
        
        location.href =
          `order-details.html?id=${card.dataset.id}`;
        
      };
      
    });
  
});
