<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "../stores/user";
import notyf from "../notyf";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const login = async () => {

    isLoading.value = true;

    try {

        await userStore.login(
            email.value,
            password.value
        );

        notyf.success("Login successful");

        router.push({
            name: "home"
        });

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to login"
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

                    <div class="text-center mb-4">
                        <img
                            src="/techzzi.png"
                            alt="Techzzi"
                            width="90"
                            height="90"
                            class="object-fit-contain mb-2"
                        >

                        <h1 class="h3">
                            Login
                        </h1>

                        <p
                            class="small mb-0 tech-secondary-text"
                        >
                            Welcome back to Techsilog.
                        </p>
                    </div>

                    <form @submit.prevent="login">

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
                            {{ isLoading ? "Logging in..." : "Login" }}
                        </button>

                    </form>

                    <p class="text-center small mt-3 mb-0">
                        No account yet?

                        <RouterLink
                            to="/register"
                            class="tech-accent-text"
                        >
                            Register
                        </RouterLink>
                    </p>

                </div>
            </div>

        </div>
    </div>
</template>
