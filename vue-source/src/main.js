import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import About from './components/About.vue'
import Contribute from './components/Contribute.vue'
import Home from './components/Home.vue'
import Search from './components/Search.vue'
import Support from './components/Support.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Search', component: Search },
        { path: '/home', name: 'Home', component: Home },
        { path: '/about', name: 'About', component: About },
        { path: '/contribute', name: 'Contribute', component: Contribute },
        { path: '/search', name: 'Search', component: Search },
        { path: '/support', name: 'Support', component: Support },
    ]
});

const app = createApp(App);
app.use(router),
app.mount('#app')
