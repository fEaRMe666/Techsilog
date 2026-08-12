<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import api from "../api";
import notyf from "../notyf";

const router = useRouter();

const email = ref("");
const username = ref("");
const password = ref("");
const isLoading = ref(false);

const register = async () => {

    isLoading.value = true;

    try {

        await api.post("/users/register", {
            email: email.value,
            username: username.value,
            password: password.value
        });

        notyf.success("Registration successful");

        router.push({
            name: "login"
        });

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to register"
        );

    } finally {

        isLoading.value = false;
    }
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">

            <div
                class="card border tech-surface tech-border"
            >
                <div class="card-body p-4">

                    <h1 class="h3 text-center mb-1">
                        Create Account
                    </h1>

                    <p
                        class="small text-center mb-4 tech-secondary-text"
                    >
                        Join the Techsilog prototype.
                    </p>

                    <form @submit.prevent="register">

                        <div class="mb-3">
                            <label
                                for="username"
                                class="form-label"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                v-model="username"
                                type="text"
                                class="form-control"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label
                                for="email"
                                class="form-label"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                v-model="email"
                                type="email"
                                class="form-control"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label
                                for="password"
                                class="form-label"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                v-model="password"
                                type="password"
                                class="form-control"
                                required
                            >
                        </div>

                        <button
                            class="btn w-100 tech-primary-btn"
                            type="submit"
                            :disabled="isLoading"

                        >
                            {{ isLoading ? "Registering..." : "Register" }}
                        </button>

                    </form>

                </div>
            </div>

        </div>
    </div>
</template>
