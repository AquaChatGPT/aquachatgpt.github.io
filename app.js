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
var subject = "";
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

function replaceSpaces(input)
{
    let rep = "%20"
    for(let i=0 ; i<input.length ; i++)
    {
        if(input[i] == ' ')
            input = input.replace(input[i],rep);
    }
    return input;
}


// Load tips from Firestore
const tipsContainer = document.getElementById("tipsContainer");
const tipMessage = document.getElementById("message");
async function loadTips() {
    document.getElementById('edits').style.display = 'none';
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

     var view = "/?id=" + doc.data().key + "&view=yes";
     var edit = "/?id=" + doc.data().key
     //replaceSpaces
     //<a class="email" title="Email a friend" href="#" onclick="javascript:window.location='mailto:?subject=Interesting information&body=I thought you might find this information interesting: ' + window.location;">Email</a>
     var share = "https://aquachatgpt.github.io" + view;
     removewebsiteYes = "<a href='" + removewebsiteYes + "' style='font-size: 10px;color: darkgrey;'>Click here to remove this post! (this can be restored)</a>";
     edit = "<a href='" + edit + "' style='font-size: 10px;color: slateblue;'>Edit</a>";
     view = "<a href='" + view + "' style='font-size: 10px;color: slateblue;'>Share</a>";
      //<a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>
     share = '<a href="mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website&body=' + share + '">Share</a>'
    //doc.data().content.substr(0,20) + "... By: " + doc.data().name  + "
     console.log("Share " + share);
    if ((doc.data().url == null) || (doc.data().url == ""))
    {
 tipElement.innerHTML = "<details name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,20) + "... By: " + doc.data().name  + " </summary><article><p>" + doc.data().content + "</p><hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "," + date + "<br><br>" + edit + "   |    " + view  +  "<br><br>"  + removewebsiteYes + "</p></center></article></details>";
  }else{
 tipElement.innerHTML = "<details name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,20) + "... By: " + doc.data().name  + "</summary><article><p>" + doc.data().content + "</p><p style='font-size: 8pt;'><a href='" + doc.data().url + "' target='_blank'>Click to view ChatGPT conversation or website!</a></p><hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "," + date + "<br><br>" + edit + "   |    " + view  +"<br><br>"  + removewebsiteYes + "</p></center></article></details>";
  }
       tipsContainer.appendChild(tipElement);
  });
  console.log("count is: " + count);
  if (count == undefined){
      tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Posts, Create One!</p></center>";
  }
  tipMessage.innerHTML = "<hr><br><center><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadRemovedTips()' href='javascript:void(0);'>Click Here to Restore Posts</a><br><br><br>Questions/Comments? Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>, ext 4574</p></center>";
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
      removewebsiteNo = "<a href='" + removewebsiteNo + "' style='font-size: 10px;color: darkgrey;'>Click here to restore this post!</a>"
      if ((doc.data().url == null) || (doc.data().url == ""))
      {
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 10pt;color: red;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name  + "</summary><article><p>" + doc.data().content + "</p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "<br><br>" + removewebsiteNo + "</p></center></article></details>";
    }else{
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 10pt;color: red;'>" + doc.data().content.substr(0,30) + " ... By: " + doc.data().name + "</summary><article><p>" + doc.data().content + "</p><p style='font-size: 8pt;'><a href='" + doc.data().url + "' target='_blank'>   Click to view ChatGPT conversation or website!</a></p><center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + "<br><br>" + removewebsiteNo + "</p></center></article></details>";
    }
         tipsContainer.appendChild(tipElement);
    });
    console.log("count is: " + count);
    if (count == undefined){
        tipsContainer.innerHTML = "<center><p style='font-size: 10px;color: red;'>No Data, Please Go Home!</p></center>";
    }
    tipMessage.innerHTML = "<hr><center><br><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadTips()' href='javascript:void(0);'>Click Here to Go Home</a><br><br><br>Questions/Comments? Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>, ext 4574</p></center>";

  }

  var clear = function(){
    document.getElementById('news').style.display = 'none';
    document.getElementById('tipsContainer').style.display = 'none';
    document.getElementById('edits').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    //document.getElementById('id').style.display = 'contents';
}

var unclear = function(){
    document.getElementById('news').style.display = 'none';
    document.getElementById('tipsContainer').style.display = 'none';
    document.getElementById('edits').style.display = 'none';
    document.getElementById('message').style.display = 'block';
    //document.getElementById('id').style.display = 'contents';
}

var loadit = function(){
    document.getElementById('news').style.display = 'block';
    document.getElementById('tipsContainer').style.display = 'block';
    document.getElementById('edits').style.display = 'block';
    document.getElementById('message').style.display = 'block';
    //document.getElementById('id').style.display = 'contents';
}

var reload = function(){
    window.history.replaceState(null, '', window.location.pathname);
    location.reload();
}

var loadEdit = function(data){
    tipMessage.innerHTML  = "";
    var count;
    var db = firebase.firestore();
    var get_id = data["id"];
    console.log("ID is: " + get_id);
    db.collection("tips").where("key", "==",get_id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            count = querySnapshot.size;

     //var removewebsiteYes = "/?id=" + doc.data().key + "&Remove=Yes";
     document.getElementById("id").value = get_id
     document.getElementById("employeeName2").value = doc.data().name;
     document.getElementById("tipContent2").value = doc.data().content;
     document.getElementById("url2").value = doc.data().url;
  });
  tipMessage.innerHTML = "<hr><center><br><p style='font-size: 10px;color: lightslategrey;'> <a onclick='reload()' href='javascript:void(0);'>Click Here to Go Home</a><br><br><br>Questions/Comments? Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>, ext 4574</p></center>";

});
clear();
setTimeout(openedit, 1000)
console.log("count is asdasd:  "  + count);
 }

 function emailCurrentPage() {
   

        var strrep ,ptitle = document.title;
     
     strrep= ptitle.replace(/"/g,'%22');
     strrep= ptitle.replace(/&/g,'%26');
     
     var mailtourl = "mailto:?subject=AquaChatGPT: " + subject + "&body=I thought you might find this information interesting:%0D%0A"+encodeURIComponent(location.href);
     location.href = mailtourl;
     return false
   
}

 var loadView = function(data){
    unclear();
    var count;
    var db = firebase.firestore();
    var get_id = data["id"];
    console.log("loadview: " + get_id);
    const tipsContainer = document.getElementById("viewtipsContainer");
    tipsContainer.innerHTML = "";
    tipMessage.innerHTML = "";
const tipElement = document.createElement("div");
tipElement.classList.add("tip");
    db.collection("tips").where("key", "==",get_id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const date = formatDate(doc.data().timestamp);
            count = querySnapshot.size;
            var removewebsiteYes = "/?id=" + doc.data().key + "&Remove=Yes";
            subject = doc.data().content.substr(0,30) + "... By: " + doc.data().name;
            var view = "/?id=" + doc.data().key + "&view=yes";
            var edit = "/?id=" + doc.data().key;
            removewebsiteYes = "<a href='" + removewebsiteYes + "' style='font-size: 10px;color: darkgrey;'>Click here to remove this post! (this can be restored)</a>";
            edit = "<a href='" + edit + "' style='font-size: 10px;color: slateblue;'>Edit</a>";
            view = "<a href='" + view + "' style='font-size: 10px;color: slateblue;'>View</a>";
        if ((doc.data().url == null) || (doc.data().url == ""))
           {
        tipElement.innerHTML = "<details id='chats' name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,20) + "... By: " + doc.data().name  + "</summary><article><p>" + doc.data().content + "</p><hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "," + date + "<br><br>" + edit +  "<br><br></p></center></article></details>";
         }else{
        tipElement.innerHTML = "<details id='chats' name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,20) + " ...  By: " + doc.data().name + "</summary><article><p>" + doc.data().content + "</p><p style='font-size: 8pt;'><a href='" + doc.data().url + "' target='_blank'>Click to view ChatGPT conversation or website!</a></p><hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "," + date + "<br><br>" + edit + "<br><br></p></center></article></details>";
         }
               tipsContainer.appendChild(tipElement);
          });
          console.log("count is: " + count);
          if (count == undefined){
              tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Data, Please Go Home!</p></center>";
          }
          // window.location.href = "mailto:?subject=" + document.title + "&body=" + encodeURI(document.location);
          //<button onclick="emailCurrentPage()">Email page</button>
          tipMessage.innerHTML = "<hr><center><br><button onclick='emailCurrentPage()'>Email This Example!</button><p style='font-size: 10px;color: lightslategrey;'> <a onclick='reload()' href='javascript:void(0);'>Click Here to Go Home</a><br><br><br>Questions/Comments? Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>, ext 4574</p></center>";
  });
console.log("count is asdasd:  "  + count);
setTimeout(openit, 1000)
 }

 function openit() {
    document.getElementById("chats").open = true;
    document.getElementById('edits').style.display = 'none';
  }

  function openedit(){
    document.getElementById('tipsContainer').style.display = 'none';
    document.getElementById('edits').style.display = 'block';
    document.getElementById('message').style.display = 'block';
  }
 // Form submission
const EditForm = document.getElementById("EditForm");
EditForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  var id = document.getElementById("id").value;
  var content = document.getElementById("tipContent2").value;
  var link = document.getElementById("url2").value;
  console.log("id: " + id );
  console.log("content: " + content );
  console.log("link: " + link );
  var datas = {
    "id": id,
    "tipcontent": content,
    "url": link
}
console.log("datas: " + datas.tipcontent );
updatedatabase(datas);
});


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
      clear();
      reload();
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
      clear();
      reload();
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
var idview = urlParams.get('view')
console.log("idview:" + idview);
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

if (id != null && id != '') {
    var data = {
        "id": id
    }
    loadEdit(data);
} else {
    console.log('string IS empty');
}    

if ((id != null && id != '') && (idview === 'yes' )) {
    var data = {
        "id": id
    }
    loadView(data);
} else {
    console.log('string IS empty');
}     


var updatedatabase = function(data){
    var db = firebase.firestore();
    var key = data["id"];
    var tipcontent = data["tipcontent"];
    var url = data["url"];
    console.log("key is: " + key);
    console.log("content is: " + tipcontent);
    console.log("url is: " + url);
    db.collection("tips").doc(key).update({
        content: data["tipcontent"],
        url: data["url"]
    }) .then(function(doc) {
        console.log("doc updated");
        window.history.replaceState(null, '', window.location.pathname);
        location.reload();
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

