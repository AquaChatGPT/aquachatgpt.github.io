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
const tipMessage = document.getElementById("message");
async function loadTips() {
  tipsContainer.innerHTML = "";
  const snapshot = await db.collection("tips").orderBy("timestamp", "desc").get();
  snapshot.forEach((doc) => {
    const tipData = doc.data();
    const date = formatDate(doc.data().timestamp);
console.log(date);
    const tipElement = document.createElement("div");
    tipElement.classList.add("tip");
    console.log(doc.data().url);
    if ((doc.data().url == null) || (doc.data().url == ""))
    {
 tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: cadetblue;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name  + "</summary><p>" + doc.data().content + "</p><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "</p>";
  }else{
 tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: cadetblue;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name + "</summary><p>" + doc.data().content + "</p><p><a href='" + doc.data().url + "' target='_blank'>link</a></p><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "</p>";
  }
       tipsContainer.appendChild(tipElement);
  });
  tipMessage.innerHTML = "<hr><center><p style='font-size: 10px;color: grey;'>If you need a post removed, please contact Chuck Konkol, ext. 4574</p></center>";
}

// Initial load
loadTips();
//load date from timestamp
function formatDate(date) {
    const formatDate = new Date(
        date.seconds * 1000 + date.nanoseconds / 1000000
    );
    return formatDate.toLocaleTimeString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}


