<template>
    <SearchBar
        :value_in="quick_search_string"
        @value_out="updateResults"
    ></SearchBar>

    <div v-if="error" class="error">Sorry, unable to query server!</div>
    <div v-else>
        <!-- <div
            v-for="filter in filters_selected"
            :key="filter"
            class="filters-selected-container"
        >
            <div v-for="selected in filter" :key="selected">
                {{ selected }} &nbsp; X
            </div>
        </div> -->
        <div class="filter-search-container">
            <div class="filters-container">
                <div class="label">Filters</div>
                <hr />
                <div v-for="filter in filters" :key="filter">
                    <FilterItem
                        :filter="filter"
                        :selected_in="filters_selected[filter.key]"
                        @selected_out="filterUpdated"
                    ></FilterItem>
                </div>
            </div>
            <div class="results-container">
                <div class="results-header">
                    <div>
                        <span class="label">Search Results:</span>
                        <span>{{ search_result["hits-total"] }}</span>
                    </div>
                    <div class="pagination">
                        <button @click="gotoPage('first')" :disabled="no_prev">
                            &lt;&lt;
                        </button>
                        <button @click="gotoPage('prev')" :disabled="no_prev">
                            &lt;
                        </button>
                        <button @click="gotoPage('next')" :disabled="no_next">
                            &gt;
                        </button>
                        <button @click="gotoPage('last')" :disabled="no_next">
                            &gt;&gt;
                        </button>
                    </div>
                    <div>
                        <b>Items per page: </b>
                        <span id="v-model-select">
                            <select
                                v-model="items_per_page"
                                @change="changeItemsPerPage"
                            >
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div class="sortby"><b>Sort By:</b> Latest First</div>
                <hr />
                <div v-for="(item, index) in search_result.results" :key="item">
                    <ResultItem :index="start_index + index" :item="item" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FilterItem from "./FilterItem.vue";
import ResultItem from "./ResultItem.vue";
import SearchBar from "./SearchBar.vue";

export default {
    name: "Search",
    error: "",

    components: { FilterItem, ResultItem, SearchBar },

    data() {
        return {
            error: false,
            current_page: 1,
            facet_names: {
                keywords: ["Keywords", "show"],
                "author_org.name": ["Author Organization(s)", "show"], // has bug showing incorrect values corresponding with org name
                author_names: ["Authoring Person(s) Names", "show"], // question of whether this should be hidden
                language_primary: ["Original Languages", "show"],
                languages_secondary: ["Additional Languages", "show"],
                target_audience: ["Target Audiences", "show"],
                access_cost: ["Access Cost", "show"],
                license: ["License", "show"],
                "accessibility_features.name": [
                    "Accessibility Features",
                    "show",
                ],
                subject: ["Subject Discipline", "show"],
                media_type: ["Media Type", "show"],
                lr_type: ["Learning Resource Type", "show"],
                purpose: ["Educational Purpose", "show"],
                "ed_frameworks.name": ["Educational Frameworks", "show"], // uncomment this line when ed_frameworks key issue is resolved in API
            },
            filters: [],
            filters_selected: {},
            items_per_page: 10,
            no_next: false,
            no_prev: true,
            num_pages: 0,
            offset: 0,
            quick_search_string: "",
            search_result: [],
            sort_str: "score desc",
            start_index: 1,
        };
    },

    methods: {
        changeItemsPerPage() {
            // console.log("changeItemsPerPage: ", this.items_per_page);
            // items_per_page becomes a string after user change the value so
            // need to force it back to int here
            this.items_per_page = parseInt(this.items_per_page);
            // console.log("items_per_page 2 = ", this.items_per_page);
            this.getSearchResults();
        },

        doClear() {
            this.quick_search_string = "";
            this.filters_selected = {};
            this.getSearchResults();
        },

        filterUpdated(data) {
            // console.log("filterUpdated!", data);
            // console.log("data key = ", data.key);
            // console.log("data options = ", data.selected_options);
            // this.filters_selected = {};
            if (data) {
                // console.log("data : ", data);
                // console.log("filters_selected 1 : ", this.filters_selected);
                this.filters_selected[data.key] = data.selected_options;
                // console.log("filters_selected 2 : ", this.filters_selected);
            }

            this.updatePagination(1, 0);
            this.getSearchResults();
        },

        getSearchResults() {
            //console.log("entered getSearchResults()");
            // console.log("quick_search_string = ", this.quick_search_string);

            this.error = false;
            let body = this.setupPostContent();
            //console.log("body: ", body);

            fetch("https://esip-dev-02.edacnm.org/api/resources/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
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
                    this.isLoading = false;
                    // console.log("result :", result);
                    this.search_result = result;
                    this.filters = this.setupFilters(result.facets);
                    // console.log("search_result :", this.search_result);
                })
                .catch(() => {
                    this.error = true;
                });
        },

        gotoPage(page) {
            // console.log("page = ", page);
            // console.log("hits total = ", this.search_result["hits-total"]);
            // console.log("offset = ", this.offset);
            // console.log("items_per_page = ", parseInt(this.items_per_page));
            let offset = 0,
                start = 1;

            if (page == "first") {
                offset = 0;
                start = 1;
            } else if (page == "next") {
                offset = this.offset + this.items_per_page;
                start = this.start_index + this.items_per_page;
            } else if (page == "prev") {
                offset = this.offset - this.items_per_page;
                start = this.start_index - this.items_per_page;
            } else if (page == "last") {
                offset = this.search_result["hits-total"] - this.items_per_page;
                start =
                    this.search_result["hits-total"] - this.items_per_page + 1;
            }

            this.updatePagination(start, offset);
            this.getSearchResults();
        },

        setupFilters(result_filters) {
            // console.log("setupFilters: ", result_filters);
            // console.log("keywords : ", result_filters["keywords"]);
            //console.log("1 facet_names", this.facet_names);
            const keys = Object.keys(this.facet_names);
            // console.log("keys = ", keys);
            let filters = [];
            // console.log("filters 1", this.filters);
            keys.forEach((key) => {
                // console.log("key = ", key);
                let value = this.facet_names[key];
                // console.log("value : ", value);
                if (value[1] === "show") {
                    // console.log("show ", key);
                    if (result_filters[key]) {
                        filters.push({
                            key: key,
                            title: value[0],
                            options: result_filters[key],
                        });
                    }
                }
            });
            // console.log("Search filters : ", filters);
            return filters;
        },

        // Gather the post body information
        setupPostContent() {
            let post_content = { search: [] };
            post_content.limit = this.items_per_page;
            post_content.offset = this.offset;
            post_content.sort_str = this.sort_str;
            //console.log("xquick_search_string = ", this.quick_search_string);

            if (this.quick_search_string.length > 0) {
                post_content.search.push({
                    group: "and",
                    and: [],
                    or: [
                        {
                            field: "keywords",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "abstract_data",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "title",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "locator_data",
                            string: this.quick_search_string,
                            type: "match",
                        },
                        {
                            field: "authors.familyName",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "authors.givenName",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "target_audience",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                        {
                            field: "author_org.name",
                            string: this.quick_search_string,
                            type: "simple",
                        },
                    ],
                });
            } else {
                // console.log("in else!");
                // simple search
                post_content.search.push({
                    group: "and",
                    and: [],
                    or: [{ field: "id", string: "*", type: "simple" }],
                });
                // post_content.search.push({
                //     group: "and",
                //     and: [
                //         {
                //             field: "keywords",
                //             string: "Access rights",
                //             type: "match",
                //         },
                //     ],
                // });
            }

            // Karl's original status section
            post_content.search.push({
                group: "and",
                and: [
                    {
                        field: "status",
                        string: "true",
                        type: "simple",
                    },
                ],
            });

            let keys = Object.keys(this.filters_selected);
            // console.log("keys : ", keys);
            // console.log("filters_selected: ", this.filters_selected);
            // console.log("length = ", this.filters_selected.length);
            // console.log("yfilters_selected: ", this.filters_selected);
            // Now add the facet selections
            // if (this.filters_selected) {
            if (keys.length > 0) {
                // let query_array = {
                //     group: "and",
                //     and: {
                //         field: this.filters_selected.key,
                //         string: this.filters_selected.value,
                //         type: "match",
                //     },
                // };
                // console.log("query_array 2: ", query_array);
                // console.log("filters_selected : ", this.filters_selected);

                let filters = [];
                let values = [];

                keys.forEach((key) => {
                    // console.log("key = ", key);
                    values = this.filters_selected[key];
                    // console.log("values : ", values);
                    for (let i = 0; i < values.length; i++) {
                        filters.push({
                            field: key,
                            string: values[i],
                            type: "match",
                        });
                    }
                });

                // console.log("filters : ", filters);

                // post_content.search.push({
                //     group: "and",
                //     and: [
                //         {
                //             field: this.filters_selected[0].key,
                //             string: this.filters_selected[0].value,
                //             type: "match",
                //         },
                //     ],
                // });

                post_content.search.push({
                    group: "and",
                    and: filters,
                });
            }

            // console.log("post_content = ", post_content);

            return post_content;
        },

        updatePagination(start, offset) {
            if (start <= 1) this.no_prev = true;
            else this.no_prev = false;

            if (start >= this.search_result["hits-total"] - this.items_per_page)
                this.no_next = true;
            else this.no_next = false;

            this.offset = offset;
            this.start_index = start;
        },

        updateResults(data) {
            // console.log("Search.updateResults()");
            // console.log("data = ", data);
            this.quick_search_string = data;
            this.getSearchResults();
        },
    },

    beforeMount() {
        // console.log("Search.beforeMount()");
        if (this.$route.params && this.$route.params["search_string"])
            this.quick_search_string = this.$route.params.search_string;
        // console.log("quick_search_string = ", this.quick_search_string);
    },

    // Lifecycle functions, see
    // https://v3.vuejs.org/guide/instance.html#lifecycle-diagram for more info
    mounted() {
        // console.log("Search.mounted");
        // console.log("quick_search_string = ", this.quick_search_string);
        this.getSearchResults();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
    font-weight: bold;
    text-align: center;
}

.filter-search-container {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 85%;
}

.filters-container {
    padding-right: 1em;
    width: 25%;
}

.filters-selected-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: auto;
    width: 85%;
}

.label {
    font-size: larger;
    font-weight: bold;
    padding: 0px 0.5em;
}

.pagination {
    flex-grow: 8;
}

.results-container {
    width: 70%;
}

.results-header {
    display: flex;
    text-align: center;
}

.search-container {
    display: flex;
    width: 90%;
}

.sortby {
    font-size: smaller;
    padding-left: 1em;
}
</style>
