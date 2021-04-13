<template>
    <div class="container">
        <div>
            {{ index }}.
            <span @click="toggleAbstract" class="title">
                {{ item.title }}
            </span>
            <img :src="license" class="license" />
            <img :src="access_cost" class="access_cost" />
        </div>
        <div class="authors">
            <span v-if="item.authors.length == 1"> <b>Author : </b> </span>
            <span v-else-if="item.authors.length > 1"> <b>Authors : </b> </span>
            <!-- https://stackoverflow.com/questions/42740105/vue-check-if-you-are-on-the-last-prop-of-a-v-for-loop -->
            <span v-for="(author, index) in item.authors" :key="author">
                <span v-if="index != 0">, </span>
                {{ author.givenName }} {{ author.familyName }}
            </span>
        </div>
        <div v-if="is_full">
            <div>
                <span v-html="abstract_full"></span>
            </div>
            <p class="detail_title">Key Info</p>
            <p class="detail_item">
                <b>URL:</b>
                <a :href="item.url" target="item">
                    <b>{{ item.url }}</b>
                </a>
            </p>
            <p class="detail_item">
                <b>Authoring Organization(s) Name:</b>
                {{ item.author_org.name }}
            </p>
            <p class="detail_item"><b>License:</b> {{ item.license }}</p>
            <p class="detail_item">
                <b>Access Cost:</b>
                <span v-if="item.access_cost"> Fee </span>
                <span v-else> No fee </span>
            </p>
            <p class="detail_item">
                <b>Primary Language:</b>
                <span v-if="item.language_primary == 'en'"> English </span>
                <span v-else> {{ item.language_primary }} </span>
            </p>
            <p class="detail_title">More Info</p>
            <p class="detail_item">
                <b>Keywords: </b>
                <span v-for="key in item.keywords" :key="key">
                    {{ key }},
                </span>
            </p>
            <p class="detail_item">
                <b>Subject Discipline:</b> {{ item.subject }}
            </p>
            <p class="detail_item"><b>Publisher:</b> {{ item.Publisher }}</p>
            <p class="detail_item"><b>Media Type:</b> {{ item.media_type }}</p>
            <p class="detail_item">
                <b>Contact Organization(s):</b> {{ item.contact.org }}
            </p>
            <p class="detail_title">Educational Info</p>
            <p class="detail_item"><b>Purpose:</b> {{ item.purpose }}</p>
            <p class="detail_item">
                <b>Learning Resource Type:</b> {{ item.lr_type }}
            </p>
            <p class="detail_item">
                <b>Target Audience: </b>
                <span v-for="key in item.target_audience" :key="key">
                    {{ key }},
                </span>
            </p>
            <p class="detail_item">
                <b>Intended time to complete:</b> {{ item.completion_time }}
            </p>
            <span v-if="item.ed_frameworks[0]">
                <p class="detail_item">
                    <b>Framework:</b> {{ item.ed_frameworks[0].name }}
                </p>
                <p class="detail_item">
                    <b>Framework Node: </b>
                    <span v-for="key in item.ed_frameworks[0].nodes" :key="key">
                        {{ key.name }},
                    </span>
                </p>
            </span>
        </div>

        <div v-else>
            <span v-html="abstract_short"></span>
        </div>
    </div>
</template>

<script>
import access_cost_true from "@/assets/fee.png";
import access_cost_false from "@/assets/no-fee.png";
import license_cc_by from "@/assets/cc-by.png";
import license_cc_by_sa from "@/assets/cc-by-sa.png";
import license_cc_publicdomain from "@/assets/cc-publicdomain.png";

export default {
    props: ["index", "item"],

    name: "ResultItem",
    // licenses: {
    //     "CC BY 2.0": license_cc_by,
    //     "CC BY-SA 4.0": license_cc_by_sa,
    // },

    data() {
        return {
            abstract_full: "",
            abstract_short: "",
            access_cost: access_cost_false,
            error: false,
            is_full: false,
            license: null,
            results: [],
        };
    },

    // Setup variables...
    mounted() {
        // console.log("ResultItem item : ", this.item);
        this.abstract_full = this.item.abstract_data;
        this.abstract_short =
            this.item.abstract_data.substring(0, 300) +
            "... (click on title to see full abstract & additional information)";

        if (this.item.access_cost) this.access_cost = access_cost_true;

        if (this.item.license.includes("CC BY 2.0")) {
            this.license = license_cc_by;
        } else if (this.item.license.includes("CC BY-SA 4.0")) {
            this.license = license_cc_by_sa;
        } else if (this.item.license.includes("CC BY")) {
            this.license = license_cc_by;
        } else if (this.item.license.includes("Public Domain")) {
            this.license = license_cc_publicdomain;
        } else if (this.item.license.includes("YouTube")) {
            this.license = license_cc_by;
        } else {
            this.license = license_cc_by;
        }
    },

    methods: {
        toggleAbstract() {
            this.is_full = !this.is_full;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.access_cost {
    padding-left: 0.5em;
    width: 2%;
}

.authors {
    padding-bottom: 0.5em;
    padding-top: 0.3em;
}

.container {
    border-color: silver;
    border-radius: 10px;
    border-style: solid;
    border-width: 2px;
    margin-bottom: 10px;
    padding: 15px;
}

.detail_item {
    margin: 2px;
}

.detail_title {
    background-color: gainsboro;
    font-weight: bold;
    margin-bottom: 4px;
    padding-bottom: ;
}

.license {
    padding-left: 0.5em;
    width: 10%;
}

.title {
    border: none;
    color: blue;
    display: inline;
    font-size: unset;
    font-style: normal;
    font-weight: bold;
    text-align: left;
}

.title:hover {
    cursor: pointer;
}
</style>
