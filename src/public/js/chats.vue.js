Vue.createApp({
    data() {
        return {
            socket: null,   
        }
    },

    methods: {
        async buttonJoinHandler(id) {
            const res = await fetch(`/user/valid/chat?id=${id}`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            const data = await res.json();

            console.log("button join VUE", data);

            if (!data)
                return console.error("No data in response");
            
            const redirectedURL = data.redirect.url;
            const user = data.user;

            if (user)
                this.sendUserToServer(user);
            
            window.location.href = redirectedURL;
        },

        sendUserToServer(user) {
            this.socket.emit("server.chat.connect", user);
        },

        socketInit() {
            this.socket = io();
        }
    },

    mounted() {
        this.socketInit();
    }
}).mount("#main");