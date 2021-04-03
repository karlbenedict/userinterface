<template>
    <table>
        <tr class="close">
            <td class="label">Search</td>
            <td class="spread">
                <div class="search-container">
                    <input
                        type="text"
                        placeholder=" Enter search word "
                        v-model="search_string"
                        class="full"
                        @keyup.enter="getSearchResults"
                    />
                    <button class="search-button" @click="doSearch">
                        Search
                    </button>
                    <button @click="doClear">Clear</button>
                </div>
            </td>
        </tr>
        <tr class="close">
            <td></td>
            <td>
                <div class="small">
                    This searches authors, keywords, title and description
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "SearchBar",
    props: ["value_in"],
    emits: ["value_out"],
    // error: "",

    data() {
        return {
            search_string: this.value_in,
        };
    },

    methods: {
        doClear() {
            this.search_string = "";
            if (this.$route.name == "Search")
                this.$emit("value_out", this.search_string);
        },

        doSearch() {
            // console.log("SearchBar.doSearch()");
            // console.log("search_string = ", this.search_string);
            // console.log("route name = ", this.$route.name);
            if (this.$route.name == "Search")
                this.$emit("value_out", this.search_string);
            else
                this.$router.push({
                    name: "Search",
                    params: { search_string: this.search_string },
                });
        },

        getSearchResults() {
            // console.log("SearchBar.getSearchResults()");
            // console.log("search_string = ", this.search_string);
            this.doSearch();
        },
    },

    // Lifecycle functions, see
    // https://v3.vuejs.org/guide/instance.html#lifecycle-diagram for more info
    mounted() {
        this.search_string = this.value_in;
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
    margin: auto;
    padding: 1em;
    width: 90%;
}

.close {
    padding: 0px;
}

.full {
    margin: auto;
    padding: 0px;
    width: 90%;
}

.label {
    font-size: larger;
    font-weight: bold;
    padding: 0px 0.5em;
}

.search-button {
    background-color: lightseagreen;
    color: white;
}

.search-container {
    display: flex;
    width: 90%;
}

.small {
    font-size: smaller;
}

.spread {
    width: 100%;
}
</style>
