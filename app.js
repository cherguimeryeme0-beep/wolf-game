const firebaseConfig = {
  apiKey: "AIzaSyAYt5kT5WDNKeLIKgvy1HegkW5NOiAPiTA",
  authDomain: "orient-wolf-game.firebaseapp.com",
  databaseURL: "https://orient-wolf-game-default-rtdb.firebaseio.com",
  projectId: "orient-wolf-game",
  storageBucket: "orient-wolf-game.firebasestorage.app",
  messagingSenderId: "611189979389",
  appId: "1:611189979389:web:9434299552b989ec0ca694"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const joinBtn = document.getElementById("joinBtn");
const playerNameInput = document.getElementById("playerName");
const playersList = document.getElementById("playersList");
const gameDiv = document.getElementById("game");
const roleDisplay = document.getElementById("roleDisplay");
const nightDiv = document.getElementById("nightDiv");
const nightActions = document.getElementById("nightActions");
const nextPhaseBtn = document.getElementById("nextPhaseBtn");
const dayDiv = document.getElementById("dayDiv");
const voteList = document.getElementById("voteList");
const voteBtn = document.getElementById("voteBtn");
const messageDiv = document.getElementById("messageDiv");

// Roles
const roles = ["Villager","Wolf","Seer","Hunter","Doctor"];
let assignedRole = "";
let playerName = "";
let gamePhase = "join"; // join, night, day
let selectedVote = "";

// Players join
joinBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if(!playerName) return alert("Enter your name!");

  const randomIndex = Math.floor(Math.random() * roles.length);
  assignedRole = roles[randomIndex];

  db.ref("players/" + playerName).set({
    name: playerName,
    role: assignedRole,
    alive: true
  });

  gameDiv.style.display = "block";
  playerNameInput.style.display = "none";
  joinBtn.style.display = "none";
  roleDisplay.textContent = "Your Role: " + assignedRole;
  startNight();
});

// Live Players List
db.ref("players").on("value", snapshot => {
  playersList.innerHTML = "";
  snapshot.forEach(child => {
    const p = child.val();
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.alive ? "Alive" : "Dead"})`;
    playersList.appendChild(li);
  });
});

// Night Phase
function startNight(){
  gamePhase="night";
  nightDiv.style.display="block";
  dayDiv.style.display="none";
  nightActions.innerHTML="";
  messageDiv.textContent="Night has begun!";

  db.ref("players").once("value").then(snapshot=>{
    snapshot.forEach(child=>{
      const p=child.val();
      if(!p.alive) return;

      if(p.name===playerName){
        if(p.role==="Wolf"){
          const btn=document.createElement("button");
          btn.textContent="Kill a Player";
          btn.onclick=()=>wolfKill();
          nightActions.appendChild(btn);
        }
        if(p.role==="Doctor"){
          const btn=document.createElement("button");
          btn.textContent="Protect a Player";
          btn.onclick=()=>doctorProtect();
          nightActions.appendChild(btn);
        }
        if(p.role==="Seer"){
          const btn=document.createElement("button");
          btn.textContent="Inspect a Player";
          btn.onclick=()=>seerInspect();
          nightActions.appendChild(btn);
        }
      }
    });
  });
}

// Next Phase
nextPhaseBtn.onclick = ()=>{startDay();}

// Day Phase
function startDay(){
  gamePhase="day";
  nightDiv.style.display="none";
  dayDiv.style.display="block";
  voteList.innerHTML="";
  messageDiv.textContent="Day has begun! Vote to eliminate.";

  db.ref("players").once("value").then(snapshot=>{
    snapshot.forEach(child=>{
      const p=child.val();
      if(!p.alive) return;
      const btn=document.createElement("button");
      btn.textContent=p.name;
      btn.onclick=()=>{selectedVote=p.name; messageDiv.textContent=`You selected ${selectedVote}`;};
      voteList.appendChild(btn);
    });
  });
}

// Voting
voteBtn.onclick=()=>{
  if(!selectedVote) return alert("Select a player to vote!");
  alert(`You voted to eliminate ${selectedVote}. Voting logic to apply.`);
}

// Role Actions
function wolfKill(){ alert("Wolf chooses a victim (final logic can be added)"); }
function doctorProtect(){ alert("Doctor protects a player"); }
function seerInspect(){ alert("Seer inspects a player"); }
// Listener Live + Auto-start
db.ref("players").on("value", snapshot => {
  const players = [];
  playersList.innerHTML = "";
  snapshot.forEach(child => {
    const p = child.val();
    players.push(p);
    const li = document.createElement("li");

    // Set icon based on role
    let icon = "🧍"; // default Villager
    if(p.role === "Wolf") icon = "🐺";
    if(p.role === "Doctor") icon = "💊";
    if(p.role === "Seer") icon = "🔮";
    if(p.role === "Hunter") icon = "🏹";

    li.textContent = `${icon} ${p.name}`;
    li.style.opacity = p.alive ? 1 : 0.5; // dead players faded
    playersList.appendChild(li);
  });

  // Auto-start if 5 players joined
  if(players.length >= 5 && gamePhase==="join") {
    startNight();
  }
});
