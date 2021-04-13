<template>
    <div>
        <p>
            Questions or issues with the website? Please contact
            <a href="mailto:clearinghouseEd@esipfed.org"
                >clearinghouseEd@esipfed.org</a
            >
        </p>
        <p>
            DMTC would like to acknowledge
            <a href="https://www.esipfed.org">ESIP</a>,
            <a href="https://www.imls.gov">IMLS</a> and
            <a href="https://sciencegateways.org">SGCI</a> for their support.
        </p>
        <p>
            ESIP is a collaboration among many partner organizations, activities
            are sponsored by <a href="https://www.nasa.gov">NASA</a>,
            <a href="https://www.noaa.gov">NOAA</a> and
            <a href="https://usgs.gov">USGS</a>.
        </p>
        <p>
            Copyright &copy; 2020 Earth Science Information Partners. All rights
            reserved.
        </p>
    </div>
</template>

<script>
export default {
    name: "Footer",
    props: {
        msg: String,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
    text-align: center;
}
</style>
