// Initialize socket and DOM elements
const socket = io();
const form = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatBox = document.getElementById('chatBox');
const notifySound = document.getElementById('notifySound');
const name = localStorage.getItem('gupshap-username');

// Redirect if name not found
if (!name) {
  window.location.href = '/';
} else {
  socket.emit('new-user-joined', name);
}

// Function to append messages
function appendMessage(content, type = 'message') {
  const msg = document.createElement('div');
  msg.classList.add('message-bubble', type);
  msg.innerHTML = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (type === 'incoming') {
    notifySound.play();
  }
}

// 🔽 User joins
socket.on('user-joined', (name) => {
  appendMessage(`<em>${name} joined the chat</em>`, 'info');
});

// 🔽 Message received
socket.on('receive', (data) => {
  if (data.name !== name) {
    appendMessage(`<strong>${data.name}</strong><br/>${data.message}`, 'incoming');
    notifySound.play();  // 🔔 Play sound on incoming msg
  }
});

// 🔽 Message form submit handler ✅ (You)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(`<strong>You</strong><br/>${message}`, 'outgoing');
    socket.emit('send', message);
    messageInput.value = '';
  }
});

// 🔽 User leaves
socket.on('user-left', (name) => {
  appendMessage(`<em>${name} left the chat</em>`, 'info');
});

// 🔽 Exit button
function exitChat() {
  localStorage.removeItem('gupshap-username');
  window.location.href = '/';
}
