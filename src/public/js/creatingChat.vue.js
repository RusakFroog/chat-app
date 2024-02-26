Vue.createApp({
    data() {
        return {
            registerForm: {
                nameChat: "",
            },

            errorMessage: "",
            succesMessage: "",
        }
    },

    methods: {
        async createNewChat() {
            this.resetErrorMessage();
            this.resetSuccesMessage();

            if (this.registerForm.nameChat == "")
                return this.sendErrorMessage("Enter Name of chat");

            if (!this.registerForm.nameChat.match(new RegExp(/^[a-zA-Z0-9]+$/)))
                return this.sendErrorMessage("Login couldn't contains special symbols (only a-Z, 0-9)");

            if (this.registerForm.nameChat.length < 4 || this.registerForm.nameChat.length > 50)
                return this.sendErrorMessage("Login must have a length of 4-50 symbols");

            const registerData = {
                nameChat: this.registerForm.nameChat, 
            };

            const res = await fetch("/chat/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({createData: registerData})
            });

            const resJson = await res.json();

            if (res.ok !== true)
                return this.sendErrorMessage(resJson.message);
            
            this.sendSuccesMessage(resJson.message);
        },
    
        sendErrorMessage(text) {
            this.errorMessage = text;
        },

        sendSuccesMessage(text) {
            this.succesMessage = text;
        },

        resetErrorMessage() {
            this.errorMessage = "";
        },

        resetSuccesMessage() {
            this.succesMessage = "";
        },
    },

    mounted() {

    }
}).mount("#main");