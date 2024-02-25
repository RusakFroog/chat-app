Vue.createApp({
    data() {
        return {
            registerForm: {
                loginField: "",
                passwordField: "",
                passwordRepeatField: "",
            },

            loginForm: {
                loginField: "",
                passwordField: "",
            },

            isRegisterForm: true,
            errorMessage: "",
        }
    },

    methods: {
        async registerAccount() {
            this.resetErrorMessage();

            if (this.registerForm.loginField == "" || this.registerForm.passwordField == "" || this.registerForm.passwordRepeatField == "")
                return this.sendErrorMessage("Enter Login and Password");

            if (this.registerForm.passwordField != this.registerForm.passwordRepeatField)
                return this.sendErrorMessage("Passwords doesn't match");

            if (this.registerForm.passwordField.length < 6 || this.registerForm.passwordField.length > 12)
                return this.sendErrorMessage("Password must have a length of 6-12 symbols");

            if (!this.registerForm.loginField.match(new RegExp(/^[a-zA-Z0-9]+$/)))
                return this.sendErrorMessage("Login couldn't contains special symbols (only a-Z, 0-9)");

            if (this.registerForm.loginField.length < 4 || this.registerForm.loginField.length > 30)
                return this.sendErrorMessage("Login must have a length of 4-30 symbols");

            const registerData = {
                login: this.registerForm.loginField, 
                password: this.registerForm.passwordField
            };

            const res = await fetch("/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({createData: registerData})
            });

            const resJson = await res.json();

            if (res.ok !== true)
                return this.sendErrorMessage(resJson.message);
            
            window.location.href = "/chats/all";
        },
    
        async loginAccount() {
            this.resetErrorMessage();

            if (this.loginForm.loginField == "" || this.loginForm.passwordField == "")
                return this.sendErrorMessage("Enter Login and Password");

            if (this.loginForm.loginField.length < 4 || this.loginForm.loginField.length > 30 || this.loginForm.passwordField.length < 6 || this.loginForm.passwordField.length > 12) {
                setTimeout(() => {
                    this.sendErrorMessage("Wrong Password or Login");
                }, 1000);

                return;
            }

            const loginData = {
                login: this.loginForm.loginField, 
                password: this.loginForm.passwordField
            };

            
            const res = await fetch("/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({data: loginData}),
            });

            const resJson = await res.json();

            if (res.ok !== true)
                return this.sendErrorMessage(resJson.message);
            
            window.location.href = "/";
        },

        toLogin() {
            if (this.isRegisterForm == false) 
                return;

            console.log("TO LOGIN FORM");
            
            this.resetErrorMessage();
            
            this.isRegisterForm = false;
        },

        toRegister() {
            if (this.isRegisterForm == true)
                return;
            
            console.log("TO REGISTER FORM");

            this.resetErrorMessage();
            
            this.isRegisterForm = true;
        },

        sendErrorMessage(text) {
            this.errorMessage = text;
        },

        resetErrorMessage() {
            this.errorMessage = "";
        }
    },

    mounted() { 

    }
}).mount("#main");