<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import api from "../api";
import notyf from "../notyf";

const route = useRoute();

const profile = ref(null);
const isLoading = ref(true);

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const getProfile = async () => {

    isLoading.value = true;

    try {

        const response = await api.get(
            `/users/getUserProfile/${route.params.userId}`
        );

        profile.value = response.data;

    } catch (error) {

        profile.value = null;

        notyf.error(
            error.response?.data?.message ||
            "Unable to load profile"
        );

    } finally {

        isLoading.value = false;
    }
};

onMounted(getProfile);

watch(
    () => route.params.userId,
    getProfile
);
</script>

<template>
    <div>

        <div
            v-if="isLoading"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            Loading profile...
        </div>

        <div
            v-else-if="!profile"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            User not found.
        </div>

        <template v-else>

            <div
                class="card border mb-4"
                :class="profile.user.isAdmin ? 'admin-card' : 'tech-surface tech-border'"
            >
                <div class="card-body p-4">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <h1
                            class="h3 mb-0"
                            :class="profile.user.isAdmin ? 'admin-text' : 'tech-accent-text'"
                        >
                            @{{ profile.user.username }}
                        </h1>

                        <span
                            v-if="profile.user.isAdmin"
                            class="badge admin-badge"
                        >
                            ADMIN
                        </span>
                    </div>

                    <p class="small mb-0 mt-2 tech-secondary-text">
                        {{ profile.posts.length }} posts · {{ profile.comments.length }} comments
                    </p>
                </div>
            </div>

            <div class="row g-4">

                <section class="col-12 col-lg-6">
                    <h2 class="h4 mb-3">
                        Posts
                    </h2>

                    <div
                        v-if="profile.posts.length === 0"
                        class="p-3 rounded border tech-surface tech-border"
                    >
                        No posts yet.
                    </div>

                    <div v-else class="d-grid gap-3">
                        <div
                            v-for="post in profile.posts"
                            :key="post._id"
                            class="card border"
                            :class="post.authorIsAdmin ? 'admin-card' : 'tech-surface tech-border'"
                        >
                            <div class="card-body">
                                <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
                                    <RouterLink
                                        :to="`/posts/${post._id}`"
                                        class="h5 mb-0 text-decoration-none tech-text"
                                    >
                                        {{ post.title }}
                                    </RouterLink>

                                    <span
                                        v-if="post.isArchived"
                                        class="badge text-bg-secondary"
                                    >
                                        ARCHIVED
                                    </span>
                                </div>

                                <p class="small mb-2 tech-secondary-text">
                                    {{ formatDate(post.createdOn) }} · {{ post.views }} views
                                </p>

                                <div
                                    v-if="post.tags.length > 0"
                                    class="d-flex flex-wrap gap-1"
                                >
                                    <span
                                        v-for="tag in post.tags"
                                        :key="tag"
                                        class="badge tech-tag"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="col-12 col-lg-6">
                    <h2 class="h4 mb-3">
                        Comment Activity
                    </h2>

                    <div
                        v-if="profile.comments.length === 0"
                        class="p-3 rounded border tech-surface tech-border"
                    >
                        No comments yet.
                    </div>

                    <div v-else class="d-grid gap-3">
                        <div
                            v-for="item in profile.comments"
                            :key="item.commentId"
                            class="p-3 rounded border tech-dark-panel"
                        >
                            <p class="mb-2">
                                {{ item.comment }}
                            </p>

                            <RouterLink
                                :to="`/posts/${item.postId}`"
                                class="small text-decoration-none tech-accent-text"
                            >
                                On: {{ item.postTitle }}
                            </RouterLink>

                            <p class="small mb-0 mt-1 tech-secondary-text">
                                {{ formatDate(item.createdOn) }}
                                <span v-if="item.updatedOn">
                                    · edited
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

            </div>

        </template>

    </div>
</template>
