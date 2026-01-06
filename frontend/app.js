const socket = new WebSocket("wss://mik-messenger-1.onrender.com");

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    // Show requested screen
    document.getElementById(screenId).style.display = 'flex';
}

function finishSetup() {
    const name = document.getElementById('fullName').value;
    if(!name) return alert("Please enter your name");
    
    // Connect to your WebSocket
    socket.send(JSON.stringify({
        type: "join",
        user: name,
        room: "global"
    }));
    
    showScreen('mainInterface');
}

function openChat() {
    showScreen('conversationScreen');
}

// Add logic to handle actual sending/receiving messages here as before
