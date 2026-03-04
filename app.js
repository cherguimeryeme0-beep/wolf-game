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

// Roles
const roles = ["Villager","Wolf","Seer","Hunter","Doctor"];
let assignedRole = "";
let playerName = "";

// Join Game
joinBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if(!playerName) return alert("Enter your name!");
  
  // Random Role
  const randomIndex = Math.floor(Math.random() * roles.length);
  assignedRole = roles[randomIndex];
  
  db.ref("players/" + playerName).set({
    name: playerName,
    role: assignedRole
  });

  gameDiv.style.display = "block";
  playerNameInput.style.display = "none";
  joinBtn.style.display = "none";
  roleDisplay.textContent = "Your Role: " + assignedRole;
});

// Listen for all players
db.ref("players").on("value", snapshot => {
  playersList.innerHTML = "";
  snapshot.forEach(child => {
    const player = child.val();
    const li = document.createElement("li");
    li.textContent = player.name + " (" + player.role + ")";
    playersList.appendChild(li);
  });
});

// Night & Day Phases Placeholder (to expand later)
