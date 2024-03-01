Vue.createApp({
    data() {
        return {
            titlePage: 'Chat ',
            idChat: undefined,
            enteredMessage: '',
            socket: null,
            user: null,
            modalProfile: {
                show: false,
                name: '',
                createDate: '',
            },
        }
    },

    methods: {
        async submitMessage() {
            if (this.enteredMessage.trim() == "")
                return;

            if (this.enteredMessage.length > 150)
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
                    console.error("ERROR:", data);
                }

                this.enteredMessage = "";
            }
            catch(e) {
                console.error(e);
            }
        },

        async exitFromChat() {
            await fetch(`/chat/${this.idChat}/exit`, {
                method: "POST",
                headers: { "Accept": "application/json" }
            });

            window.location.href = "/chats/all";
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
                        <div class="msg-info-name">${user.id == this.user?.id ? '' : user.name} </div>
                    </div>
    
                    <div class="msg-text">${message}</div>
    
                    <div class="msg-info">
                        <div class="msg-info-time">${this.getFormattedTime(new Date())}</div>
                    </div>
                </div>
            `;
    
            const msgchat = document.querySelector(".msger-chat");
            msgchat.appendChild(divMessage);

            this.srollDownChat();
        },

        loadPageTitle() {
            const splitedLocation = window.location.href.split("/");

            this.idChat = splitedLocation[splitedLocation.length - 1];
            this.titlePage += this.idChat; 
        },

        async seeProfile(name) {
            const res = await fetch(`/user/${name}`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            const jsonData = await res.json();

            if (res.status == 404)
                return console.log(jsonData.message);

            this.showModalProfile(jsonData.user);
        },

        showModalProfile(user) {
            const NAME_MONTH = {
                0: "Feb",
                1: "Mar",
                2: "Apr",
                3: "May",
                4: "Jun",
                5: "Jul",
                6: "Aug",
                7: "Sept",
                8: "Oct",
                9: "Nov",
                10: "Dec",
                11: "Jan",
            };

            this.modalProfile.name = user.name;
            this.modalProfile.createDate = `${new Date(user.createDate).getDate()} ${NAME_MONTH[new Date(user.createDate).getMonth()]} ${new Date(user.createDate).getFullYear()}`;
            this.modalProfile.show = true;
        },

        hideModalProfile() {
            if (!this.modalProfile.show)
                return;

            this.modalProfile.show = false;
        },

        socketInit() {
            this.socket = io();

            this.socket.on("client.chat.newMessage", (user, message) => this.createNewMessage(user, message));
        },

        srollDownChat() {
            const chatContainer = document.getElementsByClassName("msger-chat")[0];
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
        },
    },

    mounted() {
        this.socketInit();
        this.loadPageTitle();
        this.srollDownChat();
    }
}).mount("#main");