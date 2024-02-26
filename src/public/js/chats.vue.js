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

            if (!data)
                return console.error("No data in response");
            
            const redirectedURL = data.redirect.url;
            
            window.location.href = redirectedURL;
        },
    }
}).mount("#main");