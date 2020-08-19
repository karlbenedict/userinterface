
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
    let returnHTML = "\n"
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
        returnHTML = returnHTML + "<div class='facet-block'>";
        returnHTML = returnHTML + "<h2>" + key + "</h2>\n"
        //vMessage(value)
        let i = 0
        $.each( facets_sorted[key], function(item) {
            if (i < 5) {facet_vis = "facet-top"} else {facet_vis = "facet-overflow"};
            returnHTML = returnHTML + "<div class='facet-item " + facet_vis + "'>";
            let itemText = "<input type=\"checkbox\" id=\"" + key + "-" + i + "\" value=\"" + key + "|" + facets_sorted[key][i][0] + "\" name=\"" + facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] + ")\"" + ">\n";
            returnHTML = returnHTML + itemText;
            let itemLabel = "<label for=\"" + key + "-" + i + "\">" + facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] + ")</label><br/>\n"
            returnHTML = returnHTML + itemLabel;
            returnHTML = returnHTML + "</div>"
            //vMessage(itemText);
            i = i + 1;
        })
        returnHTML = returnHTML + "</div>";
    })
    //vMessage(returnHTML);
    // return the generated HTML
    $("#results-facets").html(returnHTML);
}

function resultsToHTML(results_json) {
    vMessage("Processing results ...")
    let results_array = results_json["results"];
    let returnHTML = "<div class=\"results_set\">"

    $.each( results_array, function( index, value) {
        item_number = index + offset + 1;
        vMessage(item_number + ". " + value.title)
        returnHTML = returnHTML + "\n<h3 class='result-title'>" + item_number + ". " + value.title + "</h3>\n"
        returnHTML = returnHTML + "\n<a class='result-url' href='" + value.url + "'>" + value.url + "</a>\n"
        returnHTML = returnHTML + "\n<div class='result-abstract'>" + value.abstract_data + "</div>\n"
    })

    returnHTML = returnHTML + "</div>"

    $("#results-searchresult").html(returnHTML);
}

// Search functions
function buildSearchJSON(ss = "", limit= 15, offset= 0, sort_str="score desc", status="true") {
    vMessage("Building search JSON for submission to search API from: " + search_string);
    post_content = {"search": []};
    if (ss != "") {
        post_content.search.push(
            {
                "group": "and",
                "and": [],
                "or": [
                    {"field": "keywords", "string": ss, "type": "simple"},
                    {"field": "abstract_data", "string": ss, "type": "simple"},
                    {"field": "title", "string": ss, "type": "simple"},
                    {"field": "locator_data", "string": ss, "type": "match"},
                    {"field": "authors.familyName", "string": ss, "type": "simple"},
                    {"field": "authors.givenName", "string": ss, "type": "simple"},
                    {"field": "target_audience", "string": ss, "type": "simple"},
                    {"field": "author_org.name", "string": ss, "type": "simple"}
                ]
            }
        )
    };
    if (status == "true" || status == "false" ) {
        // "true" (default) = published items
        // "false" = unpublished items
        // "" = all items (no status element added to the post JSON)
        post_content.search.push(
            {
                "group": "and",
                "and": [
                    {
                        "field": "status",
                        "string": status,
                        "type": "simple"
                    }
                ]
            }
        )
    };
    // add facet processing block here
    post_content.limit = limit;
    post_content.offset = offset;
    post_content.sort_str = sort_str;
    vMessage(post_content);
    return post_content
}

function getResults(searchJSON) {
    vMessage("Starting search process with the following search JSON:");
    vMessage(searchJSON);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: startup_request,
        contentType: 'application/json',
        data: JSON.stringify(searchJSON),
        success: processResults,
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage)}
    });
}

function processResults(data) {
    vMessage("Successfully retrieved results from server - starting processing");
    let results = data;
    let current_result_returned = results["hits-returned"];
    let current_result_count = results["hits-total"];
    vMessage(results);
    vMessage("Returned records in the result set: " + current_result_returned);
    vMessage("Total number of records in result set: " + current_result_count);
    vMessage(results["facets"]);
    facetsToHTML(results);
    resultsToHTML(results)
}

// Event handlers
$( "#quick-search-submit" ).on('click', function () {
    vMessage("Search form triggered!");
    var ss = $( "#quick-search-entry" ).val();
    let post_string = buildSearchJSON(ss);
    let post_results = getResults(post_string);
    processResults(post_results);
    return false;
});



// Document Ready code
$( document ).ready(function() {
    // initial data retrieval - get result set
    vMessage("Initial page load finished ...")

    $.ajax({
        "dataType": "json",
        "url": startup_request,
        "data": {
            "limit": 15,
            "status": 1},
        "success": processResults,
        "error": function(){console.log("error")}
    });
})
