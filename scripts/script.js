// global variables
var verbose = true;
var startup_request = "https://esip-dev-02.edacnm.org/api/resources/";

// Search-related global variables
var search_string = "";
var search_facets = {};
var search_JSON = {};
var results = {};
var current_result_returned = 0;
var current_result_count = 0;

// Generated HTML content
var facets_html = "";
var results_html = "";


// utility functions
function vMessage(message, target = "console") {
    // target parameter options:
    //  console (default) = the javascript console
    //  message = a javascript alert box
    if (verbose) {
        if (target == "console") {
            console.log(message);
        }
        else if (target == "message") {
            alert(message);
        }
        else {
            console.log("Warming: an invalid output destination was specified: " + target + ". The message was: " + message);
        };
    }
}


// conversion functions
function facetsToHTML(results_json) {
    // generate a set of checkbox blocks for the sorted (desc) facet values
    // within an html form
    let facets_dict = results_json["facets"];
    let returnHTML = "<form>\n"
    // sort the provided facets_json block
    let facets_sorted = {};
    $.each( facets_dict, function( key, value) {
        vMessage("Item: " + key);
        let entries = Object.entries(facets_dict[key]);
        let sorted = entries.sort((a, b) => b[1] - a[1]);
        facets_sorted[key] = sorted
    })

    // process the sorted array into the corresponding set of checkbox controls
    $.each( facets_sorted, function( key, value ) {
        vMessage("Processing: " + key)
        returnHTML = returnHTML + "<h2>" + key + "</h2>\n"
        vMessage(value)
        let i = 0
        $.each( facets_sorted[key], function(item) {
            let itemText = "<input type=\"checkbox\" id=\"" + key + "-" + i + "\" value=\"" + key + "|" + facets_sorted[key][i][0] + "\" name=\"" + facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] + ")\"" + ">\n";
            returnHTML = returnHTML + itemText;
            let itemLabel = "<label for=\"" + key + "-" + i + "\">" + facets_sorted[key][i][0] + "</label><br/>\n"
            returnHTML = returnHTML + itemLabel;
            //vMessage(itemText);
            i = i + 1;
        })
    })
    returnHTML = returnHTML + "</form>\n";
    vMessage(returnHTML);
    // return the generated HTML
    $("#results-facets").html(returnHTML);
}

function resultsToHTML(results_json) {
    //

}

// Search functions
function buildSearchJSON() {
    vMessage("Building search JSON for submission to search API");
}

function getResults(searchJSON) {
    vMessage("Starting search process");
}

function processResults(data) {
    vMessage("Successfully retrieved results from server - starting processing")
    results = data
    current_result_returned = results["hits-returned"];
    current_result_count = results["hits-total"];
    vMessage(results)
    vMessage("Returned records in the result set: " + current_result_returned)
    vMessage("Total number of records in result set: " + current_result_count);
    vMessage(results["facets"]);
    facetsToHTML(results)
}

// Document Ready code
$( document ).ready(function() {
    // initial data retrieval - get result set
    $.ajax({
        "dataType": "json",
        "url": startup_request,
        "data": {
            "limit": 0,
            "status": 1},
        "success": processResults,
        "error": function(){console.log("error")}
    });
})
