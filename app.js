// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNJoIZUAPnXO_L2vQctUIDQROeMzE2Iq0",
  authDomain: "messageboard-5877c.firebaseapp.com",
  databaseURL: "https://messageboard-5877c.firebaseio.com",
  projectId: "messageboard-5877c",
  storageBucket: "messageboard-5877c.appspot.com",
  messagingSenderId: "598927182615",
  appId: "1:598927182615:web:a80846bc7a3d4b33df0552"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form submission
const tipForm = document.getElementById("tipForm");
tipForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("employeeName").value;
  const content = document.getElementById("tipContent").value;
  const link = document.getElementById("url").value;

  try {
    await db.collection("tips").add({
      name: name,
      content: content,
      url: link,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    tipForm.reset();
    loadTips();  // Reload the tips after submission
  } catch (error) {
    console.error("Error adding tip: ", error);
  }
});

// Load tips from Firestore
const tipsContainer = document.getElementById("tipsContainer");
async function loadTips() {
  tipsContainer.innerHTML = "";
  const snapshot = await db.collection("tips").orderBy("timestamp", "desc").get();
  snapshot.forEach((doc) => {
    const tipData = doc.data();
    const tipElement = document.createElement("div");
    tipElement.classList.add("tip");
    if (${tipData.url} === ""){
 tipElement.innerHTML = `<h3>${tipData.name}</h3><p>${tipData.content}</p><p><a href='${tipData.url}';
  }else{
 tipElement.innerHTML = `<h3>${tipData.name}</h3><p>${tipData.content}</p><p><a href='${tipData.url}' + ' target="_blank"'>link</a></p>`;
  }
       tipsContainer.appendChild(tipElement);
  });
}

// Initial load
loadTips();
