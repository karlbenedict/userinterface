<template>
    <!-- https://www.w3docs.com/snippets/css/how-to-align-divs-side-by-side.html -->
    <div class="flex-container">
        <!-- <div class="box"> -->
        <div>
            <h2>Welcome to the DMT Clearinghouse</h2>
            <p>The Data Management Training (DMT) Clearinghouse is a registry for
              online learning resources focusing on research data management.
            </p>
            <p>It was created in a collaboration between the
              <a href="https://www.usgs.gov/centers/cdi">U.S. Geological Survey's
              Community for Data Integration</a>, the
              <a href="https://www.esipfed.org">Earth Sciences Information Partnership
              (ESIP)</a>, and <a href="https://www.dataone.org">DataONE</a>.
            </p>
            <p>For questions or feedback, please contact
              <a href="mailto:clearinghouseEd@esipfed.org">clearinghouseEd@esipfed.org</a>
            </p>
        </div>
        <!-- <div class="box"> -->
        <div>
            <!-- See https://thewebdev.info/2021/01/14/create-an-image-slider-app-with-vue-3-and-javascript/ -->
            <img :src="image" />
        </div>
    </div>
</template>

<script>

const images = [
  "https://dmtclearinghouse.esipfed.org/sites/default/files/cdi-ssf-components.jpg",
  "https://dmtclearinghouse.esipfed.org/sites/default/files/DataONE_DLC2015_sm.jpg",
  "https://dmtclearinghouse.esipfed.org/sites/default/files/DCC_lifecycle_web.jpg",
  "https://dmtclearinghouse.esipfed.org/sites/default/files/FGDC_Data%20Lifecycle%20Models%20and%20Concepts%20v13.jpg",
];

export default {
  name: 'Home',
  props: {
    msg: String
  },

  data() {
    return { index: 0, image: images[0] };
  },

  beforeMount() {
    this.autoChangeSlide();
  },

  methods: {
    autoChangeSlide() {
      setInterval(() => {
        this.next();
      }, 2000);
    },
    next() {
      this.index = (this.index + 1) % images.length;
      this.image = images[this.index];
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* .box {
  float: left;
  width: 45%;
  padding: 10px;
} */

.flex-container {
  /* background-color:blue; */
  display: flex;
  justify-content: center;
  /* width: 85%; */
}

/* .container {
  align-content: center;
  content: "";
  display: table;
  clear: both;
  text-align: left;
} */

a {
  color: #42b983;
}
</style>
