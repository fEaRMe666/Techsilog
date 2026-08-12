<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import api from "../api";
import notyf from "../notyf";
import { useUserStore } from "../stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref(null);
const comment = ref("");
const editingCommentId = ref(null);
const editingCommentText = ref("");
const isLoading = ref(true);
const isCommenting = ref(false);

const isOwner = computed(() => {

    if (!post.value || !userStore.user) {
        return false;
    }

    return post.value.authorId === userStore.user._id;
});

const canDelete = computed(() => {

    if (!userStore.user) {
        return false;
    }

    return isOwner.value || userStore.user.isAdmin;
});

const hasUpvoted = computed(() => {

    if (!post.value || !userStore.user) {
        return false;
    }

    return post.value.upvotes.some(
        userId => userId === userStore.user._id
    );
});

const hasDownvoted = computed(() => {

    if (!post.value || !userStore.user) {
        return false;
    }

    return post.value.downvotes.some(
        userId => userId === userStore.user._id
    );
});

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const canEditComment = (item) => {

    if (!userStore.user) {
        return false;
    }

    return item.userId === userStore.user._id;
};

const canDeleteComment = (item) => {

    if (!userStore.user) {
        return false;
    }

    return (
        item.userId === userStore.user._id ||
        userStore.user.isAdmin
    );
};

const hasCommentUpvoted = (item) => {

    if (!userStore.user) {
        return false;
    }

    return item.upvotes.some(
        userId => userId === userStore.user._id
    );
};

const hasCommentDownvoted = (item) => {

    if (!userStore.user) {
        return false;
    }

    return item.downvotes.some(
        userId => userId === userStore.user._id
    );
};

const getPost = async () => {

    isLoading.value = true;

    try {

        const response = await api.get(
            `/posts/getPost/${route.params.postId}`
        );

        post.value = response.data;

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to load post"
        );

    } finally {

        isLoading.value = false;
    }
};

const votePost = async (vote) => {

    if (!userStore.isLoggedIn) {
        notyf.error("Login first to vote");
        router.push({ name: "login" });
        return;
    }

    try {

        const response = await api.patch(
            `/posts/votePost/${route.params.postId}`,
            {
                vote: vote
            }
        );

        post.value.upvotes = response.data.upvotes;
        post.value.downvotes = response.data.downvotes;

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to vote"
        );
    }
};

const archivePost = async () => {

    try {

        const response = await api.patch(
            `/posts/archivePost/${route.params.postId}`
        );

        post.value = response.data.post;
        notyf.success(response.data.message);

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to archive post"
        );
    }
};

const addComment = async () => {

    if (!comment.value.trim()) {
        return;
    }

    isCommenting.value = true;

    try {

        const response = await api.post(
            `/posts/addComment/${route.params.postId}`,
            {
                comment: comment.value
            }
        );

        comment.value = "";
        post.value = response.data.post;

        notyf.success("Comment added");

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to add comment"
        );

    } finally {

        isCommenting.value = false;
    }
};

const voteComment = async (item, vote) => {

    if (!userStore.isLoggedIn) {
        notyf.error("Login first to vote");
        router.push({ name: "login" });
        return;
    }

    try {

        const response = await api.patch(
            `/posts/voteComment/${route.params.postId}/${item._id}`,
            {
                vote: vote
            }
        );

        item.upvotes = response.data.upvotes;
        item.downvotes = response.data.downvotes;

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to vote on comment"
        );
    }
};

const startEditComment = (item) => {
    editingCommentId.value = item._id;
    editingCommentText.value = item.comment;
};

const cancelEditComment = () => {
    editingCommentId.value = null;
    editingCommentText.value = "";
};

const updateComment = async (commentId) => {

    if (!editingCommentText.value.trim()) {
        return;
    }

    try {

        const response = await api.patch(
            `/posts/updateComment/${route.params.postId}/${commentId}`,
            {
                comment: editingCommentText.value
            }
        );

        post.value = response.data.post;
        cancelEditComment();

        notyf.success("Comment updated");

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to update comment"
        );
    }
};

const deleteComment = async (commentId) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await api.delete(
            `/posts/deleteComment/${route.params.postId}/${commentId}`
        );

        post.value = response.data.post;
        notyf.success("Comment deleted");

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to delete comment"
        );
    }
};

const deletePost = async () => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.delete(
            `/posts/deletePost/${route.params.postId}`
        );

        notyf.success("Post deleted successfully");

        router.push({
            name: "home"
        });

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to delete post"
        );
    }
};

onMounted(getPost);
</script>

<template>
    <div>

        <div
            v-if="isLoading"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            Loading post...
        </div>

        <div
            v-else-if="!post"
            class="p-4 rounded border text-center tech-surface tech-border"
        >
            Post not found.
        </div>

        <template v-else>

            <article
                class="card border mb-4"
                :class="post.authorIsAdmin ? 'admin-card' : 'tech-surface tech-border'"
            >
                <div class="card-body p-4">

                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
                        <div>
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <h1 class="h2 mb-0">
                                    {{ post.title }}
                                </h1>

                                <span
                                    v-if="post.authorIsAdmin"
                                    class="badge admin-badge"
                                >
                                    ADMIN
                                </span>

                                <span
                                    v-if="post.isArchived"
                                    class="badge text-bg-secondary"
                                >
                                    ARCHIVED
                                </span>
                            </div>

                            <RouterLink
                                :to="`/users/${post.authorId}`"
                                class="text-decoration-none"
                                :class="post.authorIsAdmin ? 'admin-text' : 'tech-accent-text'"
                            >
                                @{{ post.authorUsername }}
                            </RouterLink>

                            <p class="small mb-0 tech-secondary-text">
                                {{ formatDate(post.createdOn) }}
                            </p>
                        </div>

                        <div class="d-flex flex-wrap gap-2">

                            <RouterLink
                                v-if="isOwner"
                                class="btn btn-sm border tech-accent-btn"
                                :to="`/posts/${post._id}/edit`"
                            >
                                <i class="bi bi-pencil-square me-1"></i>
                                Edit
                            </RouterLink>

                            <button
                                v-if="isOwner"
                                class="btn btn-sm btn-outline-secondary"
                                type="button"
                                @click="archivePost"
                            >
                                <i class="bi bi-archive me-1"></i>
                                {{ post.isArchived ? "Restore" : "Archive" }}
                            </button>

                            <button
                                v-if="canDelete"
                                class="btn btn-sm btn-outline-danger"
                                type="button"
                                @click="deletePost"
                            >
                                <i class="bi bi-trash me-1"></i>
                                Delete
                            </button>

                        </div>
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

                    <p class="mb-4" style="white-space: pre-wrap;">
                        {{ post.content }}
                    </p>

                    <div class="d-flex flex-wrap align-items-center gap-3 mb-3 small">
                        <span>
                            <i class="bi bi-eye me-1"></i>
                            {{ post.views }} views
                        </span>

                        <span>
                            <i class="bi bi-chat-left-text me-1"></i>
                            {{ post.comments.length }} comments
                        </span>
                    </div>

                    <div class="d-flex flex-wrap gap-2">
                        <button
                            class="btn btn-sm border gold-vote-btn"
                            :class="{ 'gold-vote-active': hasUpvoted }"
                            type="button"
                            @click="votePost('up')"
                        >
                            <i class="bi bi-hand-thumbs-up me-1"></i>
                            {{ post.upvotes.length }}
                        </button>

                        <button
                            class="btn btn-sm border gold-vote-btn"
                            :class="{ 'gold-vote-active': hasDownvoted }"
                            type="button"
                            @click="votePost('down')"
                        >
                            <i class="bi bi-hand-thumbs-down me-1"></i>
                            {{ post.downvotes.length }}
                        </button>
                    </div>

                </div>
            </article>

            <section class="card border tech-surface tech-border">
                <div class="card-body p-4">

                    <h2 class="h4 mb-3">
                        Comments
                        <span class="small tech-secondary-text">
                            ({{ post.comments.length }})
                        </span>
                    </h2>

                    <form
                        v-if="userStore.isLoggedIn"
                        class="mb-4"
                        @submit.prevent="addComment"
                    >
                        <label for="comment" class="form-label">
                            Add Comment
                        </label>

                        <textarea
                            id="comment"
                            v-model="comment"
                            class="form-control mb-2"
                            rows="3"
                            required
                        ></textarea>

                        <button
                            class="btn btn-sm tech-primary-btn"
                            type="submit"
                            :disabled="isCommenting"
                        >
                            {{ isCommenting ? "Posting..." : "Post Comment" }}
                        </button>
                    </form>

                    <div
                        v-else
                        class="alert mb-4 border tech-dark-panel"
                    >
                        <RouterLink to="/login" class="tech-accent-text">
                            Login
                        </RouterLink>
                        to join the discussion.
                    </div>

                    <p
                        v-if="post.comments.length === 0"
                        class="mb-0 tech-secondary-text"
                    >
                        No comments yet.
                    </p>

                    <div v-else class="d-grid gap-3">
                        <div
                            v-for="item in post.comments"
                            :key="item._id"
                            class="p-3 rounded border"
                            :class="item.isAdmin ? 'admin-comment' : 'tech-dark-panel'"
                        >
                            <div class="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-2">
                                <div class="d-flex flex-wrap align-items-center gap-2">
                                    <RouterLink
                                        :to="`/users/${item.userId}`"
                                        class="text-decoration-none fw-bold"
                                        :class="item.isAdmin ? 'admin-text' : 'tech-accent-text'"
                                    >
                                        @{{ item.username }}
                                    </RouterLink>

                                    <span
                                        v-if="item.isAdmin"
                                        class="badge admin-badge"
                                    >
                                        ADMIN
                                    </span>
                                </div>

                                <span class="small tech-secondary-text">
                                    {{ formatDate(item.createdOn) }}
                                    <span v-if="item.updatedOn">
                                        · edited
                                    </span>
                                </span>
                            </div>

                            <template v-if="editingCommentId === item._id">
                                <textarea
                                    v-model="editingCommentText"
                                    class="form-control mb-2"
                                    rows="3"
                                ></textarea>

                                <div class="d-flex gap-2">
                                    <button
                                        class="btn btn-sm tech-primary-btn"
                                        type="button"
                                        @click="updateComment(item._id)"
                                    >
                                        Save
                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-secondary"
                                        type="button"
                                        @click="cancelEditComment"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </template>

                            <template v-else>
                                <p class="mb-2">
                                    {{ item.comment }}
                                </p>

                                <div class="d-flex flex-wrap gap-2">
                                    <button
                                        class="btn btn-sm border gold-vote-btn"
                                        :class="{ 'gold-vote-active': hasCommentUpvoted(item) }"
                                        type="button"
                                        @click="voteComment(item, 'up')"
                                    >
                                        <i class="bi bi-hand-thumbs-up me-1"></i>
                                        {{ item.upvotes.length }}
                                    </button>

                                    <button
                                        class="btn btn-sm border gold-vote-btn"
                                        :class="{ 'gold-vote-active': hasCommentDownvoted(item) }"
                                        type="button"
                                        @click="voteComment(item, 'down')"
                                    >
                                        <i class="bi bi-hand-thumbs-down me-1"></i>
                                        {{ item.downvotes.length }}
                                    </button>

                                    <button
                                        v-if="canEditComment(item)"
                                        class="btn btn-sm btn-outline-secondary"
                                        type="button"
                                        @click="startEditComment(item)"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        v-if="canDeleteComment(item)"
                                        class="btn btn-sm btn-outline-danger"
                                        type="button"
                                        @click="deleteComment(item._id)"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>

                </div>
            </section>

        </template>

    </div>
</template>
