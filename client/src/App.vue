<script setup>
import { onMounted } from "vue";

import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();

onMounted(async () => {

    if (userStore.token && !userStore.user) {

        try {
            await userStore.getUserDetails();
        } catch (error) {
            console.error(error);
        }
    }
});
</script>

<template>
    <div
        class="min-vh-100 d-flex flex-column tech-bg"
    >
        <NavbarComponent />

        <main class="container py-4 flex-grow-1">
            <RouterView />
        </main>

        <FooterComponent />
    </div>
</template>
