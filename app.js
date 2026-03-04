{\rtf1\ansi\ansicpg1252\cocoartf2580
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Firebase config\
const firebaseConfig = \{\
  apiKey: "YOUR_API_KEY",\
  authDomain: "YOUR_AUTH_DOMAIN",\
  databaseURL: "YOUR_DATABASE_URL",\
  projectId: "YOUR_PROJECT_ID",\
\};\
\
firebase.initializeApp(firebaseConfig);\
const db = firebase.database();\
\
// DOM elements\
const joinBtn = document.getElementById("joinBtn");\
const playerNameInput = document.getElementById("playerName");\
const playersList = document.getElementById("playersList");\
const gameDiv = document.getElementById("game");\
\
joinBtn.addEventListener("click", () => \{\
  const name = playerNameInput.value.trim();\
  if (!name) return alert("Enter your name!");\
\
  // add player to Firebase\
  const playerRef = db.ref("players/" + name);\
  playerRef.set(\{ name: name, role: "Villager" \});\
\
  // show game UI\
  gameDiv.style.display = "block";\
  playerNameInput.style.display = "none";\
  joinBtn.style.display = "none";\
\});\
\
// listen for players\
db.ref("players").on("value", snapshot => \{\
  playersList.innerHTML = "";\
  snapshot.forEach(child => \{\
    const player = child.val();\
    const li = document.createElement("li");\
    li.textContent = player.name + " (" + player.role + ")";\
    playersList.appendChild(li);\
  \});\
\});}