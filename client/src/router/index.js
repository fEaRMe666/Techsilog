import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AddPostView from "../views/AddPostView.vue";
import PostView from "../views/PostView.vue";
import EditPostView from "../views/EditPostView.vue";
import ProfileView from "../views/ProfileView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView
    },
    {
        path: "/login",
        name: "login",
        component: LoginView
    },
    {
        path: "/register",
        name: "register",
        component: RegisterView
    },
    {
        path: "/posts/add",
        name: "add-post",
        component: AddPostView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/posts/:postId",
        name: "post",
        component: PostView
    },
    {
        path: "/posts/:postId/edit",
        name: "edit-post",
        component: EditPostView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/users/:userId",
        name: "profile",
        component: ProfileView
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFoundView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {

    if (to.meta.requiresAuth && !localStorage.getItem("token")) {
        return {
            name: "login"
        };
    }
});

export default router;
