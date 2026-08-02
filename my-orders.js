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
  ordersContainer.style.background = "red";
ordersContainer.style.minHeight = "500px";
  
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
  ordersContainer.innerHTML += "<h1 style='color:white'>TEST</h1>";
});
  document.querySelectorAll(".order-card")
    .forEach(card => {
      
      card.onclick = () => {
        
        location.href =
          `order-details.html?id=${card.dataset.id}`;
        
      };
      
    });
  
});
