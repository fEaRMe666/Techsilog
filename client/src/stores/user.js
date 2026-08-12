import { defineStore } from "pinia";
import api from "../api";

export const useUserStore = defineStore("user", {

    state: () => ({
        token: localStorage.getItem("token"),
        user: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.token
    },

    actions: {

        async login(email, password) {

            const response = await api.post("/users/login", {
                email,
                password
            });

            this.token = response.data.access;
            localStorage.setItem("token", this.token);

            await this.getUserDetails();
        },

        async getUserDetails() {

            if (!this.token) {
                return;
            }

            try {

                const response = await api.get("/users/details");
                this.user = response.data;

            } catch (error) {

                this.logout();
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem("token");
        }
    }
});
