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
