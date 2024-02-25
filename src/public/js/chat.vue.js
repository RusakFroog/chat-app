Vue.createApp({
    data() {
        return {
            titlePage: 'Chat ',
            idChat: undefined,
            enteredMessage: '',
            socket: null,
            user: null
        }
    },

    methods: {
        async submitMessage() {
            if (this.enteredMessage.trim() == "")
                return;

            try {
                const res = await fetch(`/chat/${this.idChat}/add/message`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ message: this.enteredMessage })
                });

                const data = await res.json();

                if (data) {
                    if (this.user == null)
                        this.user = data.user;
        
                    this.socket.emit("server.chat.addMessage", this.user, this.enteredMessage);
                } else {
                    console.log("ERROR:", data);
                }

                this.enteredMessage = "";
            }
            catch(e) {
                console.log("error", e);
            }
        },

        getFormattedTime(time) {
            let res = '';
    
            const hours = time.getHours();
            const minutes = time.getMinutes();
    
            res += hours.toString().length == 1 ? `0${hours}:` : `${hours}:`;
            res += minutes.toString().length == 1 ? `0${minutes}` : minutes;
    
            return res;
        },

        createNewMessage(user, message) {
            const divMessage = document.createElement("div");
    
            const userClass = (user.id === this.user?.id) ? "right-msg" : "left-msg";
            divMessage.classList.add(userClass);
    
            divMessage.innerHTML = `
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">${user.name}</div>
                    </div>
    
                    <div class="msg-text">${message}</div>
    
                    <div class="msg-info">
                        <div class="msg-info-time">${this.getFormattedTime(new Date())}</div>
                    </div>
                </div>
            `;
    
            const msgchat = document.querySelector(".msger-chat");
            msgchat.appendChild(divMessage);
        },

        loadPageTitle() {
            const splitedLocation = window.location.href.split("/");

            this.idChat = splitedLocation[splitedLocation.length - 1];
            this.titlePage += this.idChat; 
        },

        socketInit() {
            this.socket = io();

            this.socket.on("client.chat.newMessage", (user, message) => this.createNewMessage(user, message));
        }
    },

    mounted() {
        this.socketInit();
        this.loadPageTitle();
    }
}).mount("#main");