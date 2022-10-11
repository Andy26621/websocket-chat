const chatBoxForm = get(".chat-box-inputarea");
const chatBoxInput = get(".chat-box-input");
const chatBoxChat = get(".chat-box-chat");
let msgId = "#"+Math.floor(Math.random() * 1000);
let socket = new WebSocket("ws://localhost:8080");

socket.onopen = function() {
    serverMessage("Server: Connected!");
};

socket.onmessage = function(event){
    if (event.data.includes(msgId) || event.data.includes("Server: ")){
        return;
    }
    appendMessage("A","left",event.data);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        serverMessage("Server: Closed cleanly");
    } else {
        serverMessage("Server: disconnected!");
    }
};
socket.onerror = function(error) {
    serverMessage(`Server: Error: ${error.message}`);
};

function get(selector, root = document) {
    return root.querySelector(selector);
}

function displayChat() {
    const x = document.getElementById("boxChat");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

chatBoxForm.addEventListener("submit", event => {
    event.preventDefault();
    msgId="#"+Math.floor(Math.random() * 1000);
    const msgText = chatBoxInput.value +"....."+msgId;

    console.log(msgText);
    if (!msgText) return;
    socket.send(msgText);
    appendMessage("You","right",msgText);
    chatBoxInput.value = "";

});

function appendMessage(user, side, text) {
    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img">${user}</div>
          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    chatBoxChat.insertAdjacentHTML("beforeend", msgHTML);
    chatBoxChat.scrollTop += 500;
}

function serverMessage(text) {
    const msgHTML = `
          <div class="msg-bubble-server">
            <div class="msg-info">
              <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>
        <div class="msg-text">${text}</div>
      </div>
  `;

    chatBoxChat.insertAdjacentHTML("beforeend", msgHTML);
    chatBoxChat.scrollTop += 500;
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}