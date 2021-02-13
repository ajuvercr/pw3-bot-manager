import { createWebHistory, createRouter } from "vue-router";
import Landing from '../components/Landing.vue';

const routes = [
    {
        path: '/',
        component: Landing,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
