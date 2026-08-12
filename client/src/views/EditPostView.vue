<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import api from "../api";
import notyf from "../notyf";
import { useUserStore } from "../stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const title = ref("");
const content = ref("");
const tags = ref("");
const post = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);

const getPost = async () => {

    isLoading.value = true;

    try {

        if (!userStore.user) {
            await userStore.getUserDetails();
        }

        const response = await api.get(
            `/posts/getPost/${route.params.postId}`
        );

        post.value = response.data;

        if (post.value.authorId !== userStore.user._id) {

            notyf.error("You can only edit your own post");

            router.push({
                name: "post",
                params: {
                    postId: route.params.postId
                }
            });

            return;
        }

        title.value = post.value.title;
        content.value = post.value.content;
        tags.value = post.value.tags.join(", ");

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to load post"
        );

        router.push({
            name: "home"
        });

    } finally {

        isLoading.value = false;
    }
};

const updatePost = async () => {

    isSaving.value = true;

    try {

        const tagList = tags.value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        await api.patch(
            `/posts/updatePost/${route.params.postId}`,
            {
                title: title.value,
                content: content.value,
                tags: tagList
            }
        );

        notyf.success("Post updated successfully");

        router.push({
            name: "post",
            params: {
                postId: route.params.postId
            }
        });

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to update post"
        );

    } finally {

        isSaving.value = false;
    }
};

onMounted(getPost);
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-12 col-lg-9">

            <div
                v-if="isLoading"
                class="p-4 rounded border text-center tech-surface tech-border"
            >
                Loading post...
            </div>

            <div
                v-else
                class="card border tech-surface tech-border"
            >
                <div class="card-body p-4">

                    <h1 class="h3 mb-4">
                        Edit Post
                    </h1>

                    <form @submit.prevent="updatePost">

                        <div class="mb-3">
                            <label for="title" class="form-label">
                                Title
                            </label>

                            <input
                                id="title"
                                v-model="title"
                                type="text"
                                class="form-control"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label for="content" class="form-label">
                                Content
                            </label>

                            <textarea
                                id="content"
                                v-model="content"
                                class="form-control"
                                rows="10"
                                required
                            ></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="tags" class="form-label">
                                Tags
                            </label>

                            <input
                                id="tags"
                                v-model="tags"
                                type="text"
                                class="form-control"
                                placeholder="Vue, JavaScript, Beginner"
                            >
                        </div>

                        <div class="d-flex flex-wrap gap-2">

                            <button
                                class="btn tech-primary-btn"
                                type="submit"
                                :disabled="isSaving"
                            >
                                {{ isSaving ? "Saving..." : "Save Changes" }}
                            </button>

                            <RouterLink
                                class="btn btn-outline-secondary"
                                :to="`/posts/${route.params.postId}`"
                            >
                                Cancel
                            </RouterLink>

                        </div>

                    </form>

                </div>
            </div>

        </div>
    </div>
</template>
