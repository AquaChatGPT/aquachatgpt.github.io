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
  var start = new Date();
  var timeadded = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString();
  //console.log(d.toString().slice(0, 19));
  timeadded = timeadded.toString().slice(0, 19)
  const id =  name + timeadded;
  var SaveDoc = db.collection("tips").doc(id);  
  SaveDoc.set({
    name: name,
content: content,
url: link,
timestamp: firebase.firestore.FieldValue.serverTimestamp(),
key:id,
remove: 'No'
})
.then(function(doc) {  
    tipForm.reset();
    loadTips();  // Reload the tips after submission
}).catch(function(error) {
   console.error("Error adding tip: ", error);
});
});

// Load tips from Firestore
const tipsContainer = document.getElementById("tipsContainer");
const tipMessage = document.getElementById("message");
async function loadTips() {
    var count;
  tipsContainer.innerHTML = "";
  const snapshot = await db.collection("tips").where("remove", "==","No").orderBy("timestamp", "desc").get();
  snapshot.forEach((doc) => {
    const tipData = doc.data();
    const date = formatDate(doc.data().timestamp);
    count = snapshot.size;
   
console.log(date);
    const tipElement = document.createElement("div");
    tipElement.classList.add("tip");
    console.log(doc.data().url);
     var removewebsiteYes = "/?id=" + doc.data().key + "&Remove=Yes";
      removewebsiteYes = "<a href='" + removewebsiteYes + "' style='font-size: 9px;color: darkgrey;'>Click here to remove this post! (this can be restored)</a>"
    if ((doc.data().url == null) || (doc.data().url == ""))
    {
 tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: red;'>" + doc.data().content.substr(0,30) + "... <font color='lightgrey'> By: " + doc.data().name  + "</font></summary><p>" + doc.data().content + "</p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "<br><br>" + removewebsiteYes + "</p></center>";
  }else{
 tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: red;'>" + doc.data().content.substr(0,30) + " ... <font color='lightgrey'> By: " + doc.data().name + "</font></summary><p>" + doc.data().content + "</p><p><a href='" + doc.data().url + "' target='_blank'>Click here to view ChatGPT conversation or website!</a></p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "<br><br>" + removewebsiteYes + "</p></center>";
  }
       tipsContainer.appendChild(tipElement);
  });
  console.log("count is: " + count);
  if (count == undefined){
      tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Posts, Create One!</p></center>";
  }
  tipMessage.innerHTML = "<hr><br><center><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadRemovedTips()' href='javascript:void(0);'>Click Here to Restore Posts</a><br><br><br>Questions/Comments? Please Contact Chuck Konkol, ext 4574</p></center>";
}

async function loadRemovedTips() {
    var count;
    tipsContainer.innerHTML = "";
    const snapshot = await db.collection("tips").where("remove", "==","Yes").orderBy("timestamp", "desc").get();
    snapshot.forEach((doc) => {
        count = snapshot.size;
      const tipData = doc.data();
      const date = formatDate(doc.data().timestamp);
  console.log(date);
      const tipElement = document.createElement("div");
      tipElement.classList.add("tip");
      console.log(doc.data().url);
      var removewebsiteNo = "/?id=" + doc.data().key + "&Remove=No";
      removewebsiteNo = "<a href='" + removewebsiteNo + "' style='font-size: 9px;color: darkgrey;'>Click here to restore this post!</a>"
      if ((doc.data().url == null) || (doc.data().url == ""))
      {
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: red;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name  + "</summary><p>" + doc.data().content + "</p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "<br><br>" + removewebsiteNo + "</p></center>";
    }else{
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 9pt;color: red;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name + "</summary><p>" + doc.data().content + "</p><p><a href='" + doc.data().url + "' target='_blank'>Click here to view ChatGPT conversation or website!</a></p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + "<br><br>" + removewebsiteNo + "</p></center>";
    }
         tipsContainer.appendChild(tipElement);
    });
    console.log("count is: " + count);
    if (count == undefined){
        tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Data, Please Go Home!</p></center>";
    }
    tipMessage.innerHTML = "<hr><center><br><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadTips()' href='javascript:void(0);'>Click Here to Go Home</a><br><br><br>Questions/Comments? Please Contact Chuck Konkol, ext 4574</p></center>";

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

var updateremoveYes = function(data){
  var db = firebase.firestore();
  var key = data["id"];
  db.collection("tips").doc(key).update({
      remove: 'Yes'
  }) .then(function(doc) {
      console.log("doc updated");
      loadTips();
      window.history.replaceState(null, '', window.location.pathname);
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

var updateremoveNO = function(data){
  var db = firebase.firestore();
  var key = data["id"];
  db.collection("tips").doc(key).update({
      remove: 'No'
  }) .then(function(doc) {
      console.log("doc updated");
      loadTips();
      window.history.replaceState(null, '', window.location.pathname);
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}


var queryString = window.location.search;
console.log(queryString);
var urlParams = new URLSearchParams(queryString);
var g_load = urlParams.get('')
console.log("g_load:" + g_load);
var id = urlParams.get('id')
console.log(id);
var id_remove = urlParams.get('Remove')
console.log("Remove:" + id_remove);
if ((id_remove === 'Yes') && (id != null && id != '')) {
    var data = {
        "id": id
    }
    updateremoveYes(data);
} else {
    console.log('string IS empty');
}      
      
if ((id_remove === 'No') && (id != null && id != '')) {
    var data = {
        "id": id
    }
    updateremoveNO(data);
} else {
    console.log('string IS empty');
}   