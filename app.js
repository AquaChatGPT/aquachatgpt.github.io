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
const database = firebase.database();

document.getElementById("counters").style.display = "none";

//add counter
// Reference to the visitor count in the database
const visitCountRef = database.ref('visitCount');
const visitCountRefDate = database.ref('visitCountDate');
 // Increment the visit count
//AquaAI Team Interactions
//document.getElementById('typed').innerText = "AquaAI Team Interactions";
function settext(){
    document.getElementById("counters").style.display = "block";
    const typed = new Typed('#typed', {
        stringsElement: '#typed-strings',
        typeSpeed: 40
      });


}

function loadip() {
    getText("https://api.ipify.org?format=js");
    async function getText(file) {
        let x = await fetch(file);
        let y = await x.text();
        document.getElementById("ip").value = y;
    }
}

 function getcount(){
    visitCountRef.transaction(currentCount => {
        if (currentCount === null) {
            return 1; // Initial visit count
} else {
            return currentCount + 1; // Increment the visit count
        }
    }).then(() => {
        // Retrieve the updated visit count and display it
        visitCountRef.on('value', snapshot => {
            document.getElementById('visitCount').innerText = snapshot.val();
const currentDate = new Date();
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};
   const newData = {
       count: snapshot.val(), // Unique identifier for the user
       datevisited: currentDate.toLocaleDateString('en', options),
       ipaddress: document.getElementById("ip").value
   };
    visitCountRefDate.push(newData);
        });
    }).catch(error => {
        console.error('Error updating visit count:', error);
});

   
}

 setTimeout(loadip, 1000);
 setTimeout(settext, 3000);
 setTimeout(getcount, 5000);

//
var subject = "";
var bodygreeting = "";
// Form submission
const tipForm = document.getElementById("tipForm");
tipForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("employeeName").value;
  const content = document.getElementById("tipContent").value;
  const link = document.getElementById("url").value;
  const summary = document.getElementById("summary").value;
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
summary: summary,
remove: 'No'
})
.then(function(doc) {  
    tipForm.reset();
    loadTips();  // Reload the tips after submission
    window.history.replaceState(null, '', window.location.pathname);
    location.reload();
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
//Load questions for summary

function copysummary(){
    var summarycopy ="Please summarize results:\n1) Suggested Prompt\n2) Tip/Trick\n3) Other"
    var x = document.getElementById("summary").value;
    if ((x == null) || (x == ""))
    {
document.getElementById("summary").value = summarycopy
    }else{
document.getElementById("summary").value = x + "\n\n" + summarycopy
    }
    
}

function copysummary2(){
    var summarycopy ="Please summarize results:\n1) Suggested Prompt\n2) Tip/Trick\n3) Other"
    var x = document.getElementById("summary2").value;
    if ((x == null) || (x == ""))
    {
document.getElementById("summary2").value = summarycopy
    }else{
document.getElementById("summary2").value = x + "\n\n" + summarycopy
    }
    
}

// Load tips from Firestore
const tipsContainer = document.getElementById("tipsContainer");
const tipMessage = document.getElementById("message");
const footer = document.getElementById("footer");
async function loadTips() {
    document.getElementById('edits').style.display = 'none';
    document.getElementById('removeit').style.display = 'block';
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
     removewebsiteYes = "<p style='text-align: right;'><a href='" + removewebsiteYes + "' title='Click to remove (this can be restored!)' style='font-size: 10px;color: #9f9494;'>Remove this post!</a></p>";
     edit = "<a href='" + edit + "'  title='Click to edit finding' style='font-size: 10px;color: slateblue;'>Edit</a>";
     view = "<a href='" + view + "'  title='Click to share!' style='font-size: 10px;color: blue;'>Share</a>";
      //<a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ Aqua ChatGPT Website'>Chuck Konkol</a>
     share = '<a href="mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ AquaAI Website&body=' + share + '">Share</a>'
     var review = doc.data().summary;
     if ((review == null) || (review == ""))
     {
        review = "";
     }else{
        review = "<br><b>Summary:</b><p>" + review.replace(/\r?\n/g, '<br />') + "</p><br><b>";
     }

     

     console.log("Share " + share);
    if ((doc.data().url == null) || (doc.data().url == ""))
    {
 tipElement.innerHTML = "<details name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,35) + "...<br>By: " + doc.data().name  + " </summary><article><b>Post:</b><p>" + doc.data().content + "</p>" + review + "<hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "<br>" + date + "<br><br>" + edit + "   |    " + view  +  "<br><br>"  + removewebsiteYes + "</p></center></article></details>";
  }else{
 tipElement.innerHTML = "<details name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,35) + "...<br>By: " + doc.data().name  + "</summary><article><b>Post:</b><p>" + doc.data().content + "</p><br><b>Link:</b><p style='font-size: 8pt;'><a href='" + doc.data().url + "'  title='Click to view link' target='_blank'>Click to view POE conversation or shared website!</a></p>" + review + "<hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "<br>" + date + "<br><br>" + edit + "   |    " + view  +"<br><br>"  + removewebsiteYes + "</p></center></article></details>";
  }
       tipsContainer.appendChild(tipElement);
  });
  console.log("count is: " + count);
  if (count == undefined){
      tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Posts, Create One!</p></center>";
  }
  //tipMessage.innerHTML = "<hr><br><center><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadRemovedTips()' href='javascript:void(0);'>Click Here to Restore Posts</a><br><br><br>Questions/Comments?<br>Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ AquaAI Website'>Chuck Konkol</a>, ext 4574</p></center>";
  tipMessage.innerHTML = "<hr><center><p style='font-size: 10px;color: lightslategrey;'><br><a onclick='loadRemovedTips()' href='javascript:void(0);'>Click Here to Restore Posts</a></p></center>";
  footer.innerHTML = "<hr><center><p style='font-size: 10px;color: lightslategrey;'>Questions/Comments?<br>Please Contact <a href='mailto:ckonkol@aqua-aerobic.com?subject=Question or Comment ~ AquaAI Website'>Chuck Konkol</a>, ext 4574</p></center>";
}

async function loadRemovedTips() {
    document.getElementById('removeit').style.display = 'none';
    var count;
    tipsContainer.innerHTML = "";
    const reviewElement = document.createElement("div");
    reviewElement.innerHTML= '<center><font size="3"><b>Inactive Posts</b></font></center>';
    reviewElement.classList.add("review");
    tipsContainer.appendChild(reviewElement);
    const snapshot = await db.collection("tips").where("remove", "==","Yes").orderBy("timestamp", "desc").get();
    snapshot.forEach((doc) => {
        count = snapshot.size;
      const tipData = doc.data();
      const date = formatDate(doc.data().timestamp);
  console.log(date);
      const tipElement = document.createElement("div");
      tipElement.classList.add("tip");
      reviewElement.classList.add("review");
      console.log(doc.data().url);
      var removewebsiteNo = "/?id=" + doc.data().key + "&Remove=No";
      removewebsiteNo = "<a href='" + removewebsiteNo + "' style='font-size: 10px;color: slateblue;'>Click here to restore this post!</a>"
      var review = doc.data().summary;
     if ((review == null) || (review == ""))
     {
        review = "";
     }else{
        review = "<br><b>Summary:</b><p>" + review.replace(/\r?\n/g, '<br />') + "</p><br><b>";
     }
      if ((doc.data().url == null) || (doc.data().url == ""))
      {
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 10pt;color: red;'>" + doc.data().content.substr(0,35) + " ...<br>By: " + doc.data().name  + "</summary><article><b>POST:</b><p>" + doc.data().content + "</p>" + review  + "<center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + date + "<br><br>" + removewebsiteNo + "</p></center></article></details>";
    }else{
   tipElement.innerHTML = "<details name='chatgpt'><summary style='font-size: 10pt;color: red;'>" + doc.data().content.substr(0,35) + " ...<br>By: " + doc.data().name + "</summary><article><b>POST:</b><p>" + doc.data().content + "</p><br><b>LINK:</b><p style='font-size: 8pt;'><a href='" + doc.data().url + "' target='_blank'>   Click to view POE conversation or other website!</a></p>" + review  + "<center><p style='font-size: 10px;color: grey;'>created by: " + doc.data().name + "," + "<br><br>" + removewebsiteNo + "</p></center></article></details>";
    }
         tipsContainer.appendChild(tipElement);
    });
    console.log("count is: " + count);
    if (count == undefined){
        tipsContainer.innerHTML = "<center><p style='font-size: 10px;color: red;'>No Data, Please Go Home!</p></center>";
    }
    tipMessage.innerHTML = "<hr><center><br><p style='font-size: 10px;color: lightslategrey;'> <a onclick='loadTips()' href='javascript:void(0);'>Click Here to Go Home</a><br><br><i>inactive posts will be removed periodically.</i></p></center>";

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
     document.getElementById("summary2").value = doc.data().summary;
  });
  tipMessage.innerHTML = "<hr><center><br><p style='font-size: 10px;color: lightslategrey;'> <a onclick='reload()' href='javascript:void(0);'>Click Here to Go Home</a></p></center>";

});
clear();
setTimeout(openedit, 1000)
console.log("count is asdasd:  "  + count);
 }

 function emailCurrentPage() {
   

        var strrep ,ptitle = document.title;
     
     strrep= ptitle.replace(/"/g,'%22');
     strrep= ptitle.replace(/&/g,'%26');
     
     var mailtourl = "mailto:?subject=AquaAI Team: " + subject + "&body=Greetings,%0D%0AI thought you might find this interesting.%0D%0A"+bodygreeting+"%0D%0A"+encodeURIComponent(location.href)+"%0D%0A%0D%0AAquaAI Team App:%0D%0Ahttps://aquaai.app/";
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
            subject = doc.data().content.substr(0,35) + "... By: " + doc.data().name;
            bodygreeting = "%0D%0APOST:%0D%0A" + doc.data().content + "%0D%0A%0D%0ABY:%0D%0A" + doc.data().name + "%0D%0A%0D%0ALINK TO POST:";
            var view = "/?id=" + doc.data().key + "&view=yes";
            var edit = "/?id=" + doc.data().key;
            removewebsiteYes = "<a href='" + removewebsiteYes + "' style='font-size: 10px;color: darkgrey;'>Click here to remove this post! (this can be restored)</a>";
            edit = "<a href='" + edit + "' title='Click to edit finding' style='font-size: 10px;color: slateblue;'>Edit</a>";
            view = "<a href='" + view + "' style='font-size: 10px;color: slateblue;'>View</a>";
            var review = doc.data().summary;
     if ((review == null) || (review == ""))
     {
        review = "";
     }else{
        review = "<br><b>Summary:</b><p>" + review.replace(/\r?\n/g, '<br />')+ "</p><br><b>";
     }
        if ((doc.data().url == null) || (doc.data().url == ""))
           {
        tipElement.innerHTML = "<details id='chats' name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,35) + "...<br>By: " + doc.data().name  + "</summary><article><b>Post:</b><p>" + doc.data().content + "</p>" + review + "<hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "<br>" + date + "<br><br>" + edit +  "<br><br></p></center></article></details>";
         }else{
        tipElement.innerHTML = "<details id='chats' name='chatgpt'><summary class='hand' style='font-size: 9pt;'>" + doc.data().content.substr(0,35) + " ...<br>By: " + doc.data().name + "</summary><article><b>Post:</b><p>" + doc.data().content + "</p><br><b>Link:</b><p style='font-size: 8pt;'><a href='" + doc.data().url + "' title='Click to view link'  target='_blank'>Click to view POE conversation or other website!</a></p>" + review + "<hr><center><p style='font-size: 10px;'>created by: " + doc.data().name + "<br>" + date + "<br><br>" + edit + "<br><br></p></center></article></details>";
         }
               tipsContainer.appendChild(tipElement);
          });
          console.log("count is: " + count);
          if (count == undefined){
              tipsContainer.innerHTML = "<center><p style='font-size: 9px;color: red;'>No Data, Please Go Home!</p></center>";
          }
          // window.location.href = "mailto:?subject=" + document.title + "&body=" + encodeURI(document.location);
          //<button onclick="emailCurrentPage()">Email page</button>
          tipMessage.innerHTML = "<hr><center><br><button title='Click to create email & share now!' onclick='emailCurrentPage()'>Share This Now!</button><p style='font-size: 10px;color: lightslategrey;'> <a onclick='reload()' href='javascript:void(0);'>Click Here to Go Home</a></p></center>";
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
  var summary = document.getElementById("summary2").value;
  console.log("id: " + id );
  console.log("content: " + content );
  console.log("link: " + link );
  console.log("summary: " + summary );
  var datas = {
    "id": id,
    "tipcontent": content,
    "url": link,
    "summary": summary
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
    var summary = data["summary"];
    console.log("key is: " + key);
    console.log("content is: " + tipcontent);
    console.log("url is: " + url);
    console.log("summary is: " + summary);
    db.collection("tips").doc(key).update({
        content: data["tipcontent"],
        url: data["url"],
        summary: data["summary"]
    }) .then(function(doc) {
        console.log("doc updated");
        window.history.replaceState(null, '', window.location.pathname);
        location.reload();
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

