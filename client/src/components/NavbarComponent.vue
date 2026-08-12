<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from "../stores/user";
import notyf from "../notyf";

const router = useRouter();
const userStore = useUserStore();

const logout = () => {

    userStore.logout();

    notyf.success("Logged out successfully");

    router.push({
        name: "home"
    });
};
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark border-bottom tech-surface tech-border">
        <div class="container">

            <RouterLink
                class="navbar-brand d-flex align-items-center gap-2 fw-bold tech-text"
                to="/"
            >
                <img
                    src="/techzzi.png"
                    alt="Techzzi"
                    width="42"
                    height="42"
                    class="object-fit-contain"
                >
                Techsilog
            </RouterLink>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#techsilogNavbar"
                aria-controls="techsilogNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div id="techsilogNavbar" class="collapse navbar-collapse">
                <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2">

                    <RouterLink class="nav-link" to="/">
                        <i class="bi bi-house-door me-1"></i>
                        Posts
                    </RouterLink>

                    <RouterLink
                        v-if="userStore.isLoggedIn"
                        class="nav-link"
                        to="/posts/add"
                    >
                        <i class="bi bi-plus-circle me-1"></i>
                        Add Post
                    </RouterLink>

                    <RouterLink
                        v-if="userStore.user"
                        class="nav-link fw-bold"
                        :class="userStore.user.isAdmin ? 'admin-text' : 'tech-accent-text'"
                        :to="`/users/${userStore.user._id}`"
                    >
                        @{{ userStore.user.username }}
                        <span v-if="userStore.user.isAdmin">
                            (Admin)
                        </span>
                    </RouterLink>

                    <RouterLink
                        v-if="!userStore.isLoggedIn"
                        class="btn btn-sm tech-primary-btn"
                        to="/login"
                    >
                        Login
                    </RouterLink>

                    <RouterLink
                        v-if="!userStore.isLoggedIn"
                        class="btn btn-sm border tech-secondary-btn"
                        to="/register"
                    >
                        Register
                    </RouterLink>

                    <button
                        v-if="userStore.isLoggedIn"
                        class="btn btn-sm border tech-secondary-btn"
                        type="button"
                        @click="logout"
                    >
                        <i class="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>

                </div>
            </div>
        </div>
    </nav>
</template>
