<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import api from "../api";
import notyf from "../notyf";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

const posts = ref([]);
const isLoading = ref(true);

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const canEditPost = (post) => {

    if (!userStore.user) {
        return false;
    }

    return post.authorId === userStore.user._id;
};

const canDeletePost = (post) => {

    if (!userStore.user) {
        return false;
    }

    return (
        post.authorId === userStore.user._id ||
        userStore.user.isAdmin
    );
};

const hasUpvoted = (post) => {

    if (!userStore.user) {
        return false;
    }

    return post.upvotes.some(
        userId => userId === userStore.user._id
    );
};

const hasDownvoted = (post) => {

    if (!userStore.user) {
        return false;
    }

    return post.downvotes.some(
        userId => userId === userStore.user._id
    );
};

const getPosts = async () => {

    isLoading.value = true;

    try {

        const response = await api.get("/posts/getAllPosts");
        posts.value = response.data;

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to load posts"
        );

    } finally {

        isLoading.value = false;
    }
};

const votePost = async (post, vote) => {

    if (!userStore.isLoggedIn) {
        notyf.error("Login first to vote");
        router.push({ name: "login" });
        return;
    }

    try {

        const response = await api.patch(
            `/posts/votePost/${post._id}`,
            {
                vote: vote
            }
        );

        post.upvotes = response.data.upvotes;
        post.downvotes = response.data.downvotes;

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to vote"
        );
    }
};

const deletePost = async (postId) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.delete(`/posts/deletePost/${postId}`);

        notyf.success("Post deleted successfully");

        await getPosts();

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to delete post"
        );
    }
};

onMounted(getPosts);
</script>

<template>
    <section>

        <div class="p-4 p-md-5 mb-4 rounded border tech-surface tech-border">
            <div class="row align-items-center g-4">

                <div class="col-md-8">
                    <p class="text-uppercase small fw-bold mb-2 tech-accent-text">
                        s89 Prototype Blog
                    </p>

                    <h1 class="display-6 fw-bold">
                        Techsilog
                    </h1>

                    <p class="mb-0 tech-secondary-text">
                        A simple space for tech thoughts, notes, and discussions.
                    </p>
                </div>

                <div class="col-md-4 text-center">
                    <img
                        src="/techzzi.png"
                        alt="Techzzi mascot"
                        class="img-fluid"
                        style="max-height: 180px;"
                    >
                </div>

            </div>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
                <h2 class="h4 mb-1">
                    Latest Posts
                </h2>

                <p class="small mb-0 tech-secondary-text">
                    Archived posts are hidden from this feed.
                </p>
            </div>

            <RouterLink
                v-if="userStore.isLoggedIn"
                class="btn tech-primary-btn"
                to="/posts/add"
            >
                <i class="bi bi-plus-circle me-1"></i>
                New Post
            </RouterLink>
        </div>

        <div
            v-if="isLoading"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            Loading posts...
        </div>

        <div
            v-else-if="posts.length === 0"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            No posts yet.
        </div>

        <div v-else class="row g-3">
            <div
                v-for="post in posts"
                :key="post._id"
                class="col-12 col-md-6 col-xl-4"
            >
                <article
                    class="card h-100 border"
                    :class="post.authorIsAdmin ? 'admin-card' : 'tech-surface tech-border'"
                >
                    <div class="card-body d-flex flex-column">

                        <div class="mb-3">
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <h3 class="h5 card-title mb-0">
                                    {{ post.title }}
                                </h3>

                                <span
                                    v-if="post.authorIsAdmin"
                                    class="badge admin-badge"
                                >
                                    ADMIN
                                </span>
                            </div>

                            <RouterLink
                                :to="`/users/${post.authorId}`"
                                class="small text-decoration-none"
                                :class="post.authorIsAdmin ? 'admin-text' : 'tech-accent-text'"
                            >
                                @{{ post.authorUsername }}
                            </RouterLink>

                            <p class="small mb-0 tech-secondary-text">
                                {{ formatDate(post.createdOn) }}
                            </p>
                        </div>

                        <div
                            v-if="post.tags.length > 0"
                            class="d-flex flex-wrap gap-1 mb-3"
                        >
                            <span
                                v-for="tag in post.tags"
                                :key="tag"
                                class="badge tech-tag"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <p class="card-text flex-grow-1">
                            {{
                                post.content.length > 140
                                    ? post.content.slice(0, 140) + "..."
                                    : post.content
                            }}
                        </p>

                        <div class="d-flex flex-wrap align-items-center gap-2 mb-3 small">
                            <span>
                                <i class="bi bi-eye me-1"></i>
                                {{ post.views }}
                            </span>

                            <span>
                                <i class="bi bi-chat-left-text me-1"></i>
                                {{ post.comments.length }}
                            </span>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-3">
                            <button
                                class="btn btn-sm border gold-vote-btn"
                                :class="{ 'gold-vote-active': hasUpvoted(post) }"
                                type="button"
                                @click="votePost(post, 'up')"
                            >
                                <i class="bi bi-hand-thumbs-up me-1"></i>
                                {{ post.upvotes.length }}
                            </button>

                            <button
                                class="btn btn-sm border gold-vote-btn"
                                :class="{ 'gold-vote-active': hasDownvoted(post) }"
                                type="button"
                                @click="votePost(post, 'down')"
                            >
                                <i class="bi bi-hand-thumbs-down me-1"></i>
                                {{ post.downvotes.length }}
                            </button>
                        </div>

                        <div class="d-flex flex-wrap gap-2">

                            <RouterLink
                                class="btn btn-sm tech-primary-btn"
                                :to="`/posts/${post._id}`"
                            >
                                Read
                            </RouterLink>

                            <RouterLink
                                v-if="canEditPost(post)"
                                class="btn btn-sm border tech-accent-btn"
                                :to="`/posts/${post._id}/edit`"
                            >
                                Edit
                            </RouterLink>

                            <button
                                v-if="canDeletePost(post)"
                                class="btn btn-sm btn-outline-danger"
                                type="button"
                                @click="deletePost(post._id)"
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                </article>
            </div>
        </div>

    </section>
</template>
