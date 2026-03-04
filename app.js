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

const joinBtn = document.getElementById("joinBtn");
const playerNameInput = document.getElementById("playerName");
const playersList = document.getElementById("playersList");
const gameDiv = document.getElementById("game");

joinBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Enter your name!");
    return;
  }

  db.ref("players/" + name).set({
    name: name,
    role: "Villager"
  });

  gameDiv.style.display = "block";
  playerNameInput.style.display = "none";
  joinBtn.style.display = "none";
});

db.ref("players").on("value", snapshot => {
  playersList.innerHTML = "";
  snapshot.forEach(child => {
    const player = child.val();
    const li = document.createElement("li");
    li.textContent = player.name + " (" + player.role + ")";
    playersList.appendChild(li);
  });
});
