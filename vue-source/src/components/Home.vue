<template>
    <!-- https://www.w3docs.com/snippets/css/how-to-align-divs-side-by-side.html -->
    <div v-if="isLoaded">
        <div class="flex-container">
            <div class="top-container">
                <ContentBlock :block="home_content['block_01']"></ContentBlock>
                <HeroImages :data="home_content['hero_images']"></HeroImages>
            </div>
            <SearchBar :value_in="nothing"></SearchBar>
            <div class="bottom-container">
                <div class="bottom-left-container">
                    <ContentBlock
                        :block="home_content['block_03']"
                    ></ContentBlock>
                    <ContentBlock
                        :block="home_content['block_04']"
                    ></ContentBlock>
                </div>
                <ContentBlock :block="home_content['block_02']"></ContentBlock>
            </div>
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script>
import ContentBlock from "./ContentBlock.vue";
import HeroImages from "./HeroImages.vue";
import SearchBar from "./SearchBar.vue";

export default {
    name: "Home",
    components: { ContentBlock, HeroImages, SearchBar },

    data() {
        return {
            home_content: {},
            index: 0,
            isLoaded: false,
            nothing: "",
        };
    },

    mounted() {
        //console.log("entered Home.mounted()");
        this.getHomeContent();
    },

    methods: {
        getHomeContent() {
            // console.log("entered getHomeContent()");
            this.isLoaded = false;
            fetch("http://static.dmtc-devel.org/source/home.json", {
                method: "GET",
                // headers: { "Content-Type": "application/json" },
                // body: JSON.stringify(body),
            })
                .then((response) => {
                    if (response.ok) {
                        // DO NOT do anything to the response, including console.log
                        // or else it will cause an error that response is "disturbed"
                        return response.json();
                    } else {
                        throw new Error();
                    }
                })
                .then((result) => {
                    //console.log("Home result = ", result);
                    this.home_content = result;
                    // console.log("home_content = ", this.home_content);
                    this.isLoaded = true;
                })
                .catch(() => {
                    //this.error = true;
                });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* background-color is to help debug layout*/

.bottom-container {
    /* background-color: bisque; */
    display: flex;
    flex-direction: row;
    padding-top: 20px;
}

.bottom-left-container {
    /* background-color: darkgray; */
    display: flex;
    flex-direction: column;
}

.flex-container {
    /* background-color: rgb(187, 255, 0); */
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* width: 50%; */
}

.top-container {
    /* background-color: rgb(182, 184, 179); */
    display: flex;
    flex-direction: row;
    /* justify-content: center; */
    padding-bottom: 20px;
    width: 95%;
}

a {
    color: #42b983;
}
</style>
