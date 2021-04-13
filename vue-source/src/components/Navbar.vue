<template>
    <div class="flex-container">
        <div class="left">
            <span>
                <router-link :to="{ name: 'Home' }">
                    <img
                        alt="ESIP logo"
                        src="@/assets/esip-logo.png"
                        class="logo"
                    />
                    <span class="title">DATA MANAGEMENT TRAINING</span>
                </router-link>
            </span>
            <span>
                <router-link :to="{ name: 'Search' }">Search</router-link>
            </span>
            <span class="link">
                <router-link :to="{ name: 'Contribute' }">
                    Contribute
                </router-link>
            </span>
            <span class="link">
                <router-link :to="{ name: 'Support' }">
                    Support
                </router-link>
            </span>
            <span class="link">
                <router-link :to="{ name: 'About' }">
                    About
                </router-link>
            </span>
        </div>
        <div class="right">
            <img alt="Login" src="@/assets/person.png" class="login" /> Login
        </div>
    </div>
</template>

<script>
export default {
    name: "Navbar",
    props: {
        msg: String,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* router-link will compile to a tag */
a {
    color: black;
    cursor: pointer;
    text-decoration: none;
    padding: 0.5em;
}

a.active,
a.router-link-active {
    /* color:blue; */
    font-weight: bold;
}

.flex-container {
    display: flex;
    justify-content: center;
    /* width: 85%; */
    vertical-align: middle;
}

.left {
    /* background-color: teal; */
    flex-grow: 8;
    vertical-align: middle;
}

.link {
    padding: 0 0.75em;
}

.login {
    vertical-align: middle;
    width: 30%;
}

.logo {
    padding: 0 1em;
    vertical-align: middle;
    width: 9%;
}

.title {
    font-size: larger;
    font-weight: bold;
    padding-right: 1em;
    vertical-align: middle;
}
</style>
