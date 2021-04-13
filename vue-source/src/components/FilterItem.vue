<template>
    <!-- * {{ filter.options }} -->
    <div v-if="display">
        <details :open="is_open">
            <summary class="smaller">
                <span class="title">{{ filter.title }}</span> ({{ total }})
            </summary>
            <div id="v-model-multiple-checkboxes">
                <div
                    v-for="(option, index) in Object.keys(filter.options)"
                    :key="option"
                >
                    <!-- <div v-if="index % 2 == 0" class="striped">stripped</div>
                    <div v-else>not stripped</div> -->
                    <div :class="background(index)">
                        <!-- checking at the key level which is some duplicated code but
                avoids some processing (v-if) during the v-for looping -->
                        <div
                            v-if="
                                filter.key == 'language_primary' ||
                                    filter.key == 'languages_secondary'
                            "
                            :for="filter.options[option]"
                        >
                            <input
                                type="checkbox"
                                :id="filter.key"
                                :value="option"
                                :checked="is_selected(option)"
                                @click="saveOption(option)"
                                class="small"
                            />
                            <label for="filter.key" class="smaller">
                                &nbsp;
                                {{ getLanguage(option) }} ({{
                                    filter.options[option]
                                }})
                            </label>
                        </div>
                        <div v-else :for="filter.options[option]">
                            <!-- wasn't able to get v-model="options_selected" instead of saveOption() to work!-->
                            <input
                                type="checkbox"
                                :id="filter.key"
                                :value="option"
                                :checked="is_selected(option)"
                                @click="saveOption(option)"
                                class="small"
                            />
                            <label for="filter.key" class="smaller">
                                &nbsp;{{ option }} ({{
                                    filter.options[option]
                                }})
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </details>
    </div>
</template>

<script>
// From https://github.com/meikidd/iso-639-1
import ISO6391 from "iso-639-1";

export default {
    props: ["filter", "selected_in"],
    emits: ["selected_out"],

    name: "FilterItem",

    data() {
        return {
            title: "",
            options_selected: [],
            // new_filter: "",
        };
    },

    mounted() {
        if (this.selected_in) {
            // console.log("FilterItem mounted filter = ", this.filter);
            // console.log("FilterItem mounted selected_in = ", this.selected_in);
            // console.log("options_selected 1 :", this.options_selected);
            this.options_selected = this.selected_in;
            // console.log("options_selected 2 :", this.options_selected);
        }
    },

    computed: {
        display() {
            // console.log("display!");
            // console.log("filter.options : ", this.filter.options);
            if (
                this.filter.options &&
                Object.keys(this.filter.options).length > 0
            )
                return true;
            else return false;
        },

        is_open() {
            if (this.selected_in && this.selected_in.length > 0) return true;
            else return false;
        },

        total() {
            return Object.keys(this.filter.options).length;
        },
    },

    methods: {
        background(index) {
            if (index % 2 == 0) return "striped";
            else return null;
        },

        getLanguage(code) {
            return ISO6391.getName(code);
        },

        is_selected(option) {
            if (this.selected_in) {
                return this.selected_in.includes(option);
            } else {
                return false;
            }
        },

        saveOption(data) {
            // console.log("saveOption : ", data);
            // console.log("checked ? ", event.target.checked);
            // console.log("options_selected : ", this.options_selected);
            // console.log("this : ", this);
            // console.log("options_selected : ", this.options_selected);
            if (event.target.checked == true) this.options_selected.push(data);
            else {
                // https://love2dev.com/blog/javascript-remove-from-array/
                for (let i = 0; i < this.options_selected.length; i++)
                    if (this.options_selected[i] == data)
                        this.options_selected.splice(i, 1);
            }
            // console.log("options_selected: ", this.options_selected);

            if (this.options_selected.length > 0)
                this.$emit("selected_out", {
                    key: this.filter.key,
                    selected_options: this.options_selected,
                    // is_selected: event.target.checked,
                });
            else this.$emit("selected_out", null);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.smaller {
    font-size: smaller;
    padding-bottom: 0.5em;
}

.striped {
    /* background-color: papayawhip; */
    /* background-color: palegoldenrod; */
    /* background-color: moccasin; */
    /* background-color: mistyrose; */
    /* background-color: lavender; */
    background-color: rgb(237, 236, 236);
    /* background-color: gainsboro; */
    /* background-color: antiquewhite; */
}

.title {
    font-weight: bold;
}
</style>
