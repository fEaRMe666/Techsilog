<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import api from "../api";
import notyf from "../notyf";

const router = useRouter();

const title = ref("");
const content = ref("");
const tags = ref("");
const isLoading = ref(false);

const addPost = async () => {

    isLoading.value = true;

    try {

        const tagList = tags.value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        const response = await api.post("/posts/addPost", {
            title: title.value,
            content: content.value,
            tags: tagList
        });

        notyf.success("Post created successfully");

        router.push({
            name: "post",
            params: {
                postId: response.data.post._id
            }
        });

    } catch (error) {

        notyf.error(
            error.response?.data?.message ||
            "Unable to create post"
        );

    } finally {

        isLoading.value = false;
    }
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-12 col-lg-9">

            <div class="card border tech-surface tech-border">
                <div class="card-body p-4">

                    <h1 class="h3 mb-1">
                        Add Blog Post
                    </h1>

                    <p class="small mb-4 tech-secondary-text">
                        Keep it simple. This is our beginner prototype editor.
                    </p>

                    <form @submit.prevent="addPost">

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

                            <small class="tech-secondary-text">
                                Separate tags with commas.
                            </small>
                        </div>

                        <div class="d-flex flex-wrap gap-2">

                            <button
                                class="btn tech-primary-btn"
                                type="submit"
                                :disabled="isLoading"
                            >
                                {{ isLoading ? "Saving..." : "Publish Post" }}
                            </button>

                            <RouterLink
                                class="btn btn-outline-secondary"
                                to="/"
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
