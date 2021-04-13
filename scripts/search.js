// Global Variables
const verbose = true;
const startup_request = "https://esip-dev-02.edacnm.org/api/resources/";

// Search-related global variables
let search_string = "";
let search_facets = {};
let post_content = {};
let offset = 0;
let limit = 10;
let sort_str="score desc";
let status="true";
let results = {};
let current_result_returned = 0;
let current_result_count = 0;



// Lookup tables -
// TODO - eventually replace these with values pulled from the API

//facet names and status (show/hide)
// TODO - hiding Author Organizations until the facet content is fixed
// TODO - hiding Educational Frameworks until the key name bug in API is resolved
const facet_names = {
    "keywords":["Keywords", "show"],
    //"author_org":["Author Organization(s)", "hide"], // has bug showing incorrect values corresponding with org name
    //"author_names":[Authoring Person(s) Names", "hide"], // question of whether this should be hidden
    "language_primary":["Original Languages", "show"],
    "languages_secondary":["Additional Languages", "show"],
    "target_audience":["Target Audiences", "show"],
    //"access_cost":["Access Cost", "show"],
    "license":["License", "show"],
    "accessibility_features.name":["Accessibility Features", "show"],
    "subject":["Subject Discipline", "show"],
    "media_type":["Media Type", "show"],
    "lr_type":["Learning Resource Type", "show"],
    "purpose":["Educational Purpose", "show"],
    "ed_frameworks":["Educational Frameworks", "hide"],                 // remove this line when the ed_frameworks key issue is resolved in API
    //"ed_frameworks.name":["Educational Frameworks", "show"],          // uncomment this line when ed_frameworks key issue is resolved in API
};



// utility functions
function vMessage(message, target = "console") {
    // target parameter options:
    //  console (default) = the javascript console
    //  message = a javascript alert box
    if (verbose) {
        if (target == "console") {
            console.log(message);
        } else if (target == "message") {
            alert(message);
        } else {
            console.log("Warning: an invalid output destination was specified: " + target + ". The message was: " + message);
        }
    }
}



// conversion functions
function facetsToHTML() {
    // generate a set of checkbox blocks for the sorted (desc) facet values
    // within an html form
    let facets_dict = results["facets"];
    let returnHTML = "\n";
    // sort the provided facets_json block
    let facets_sorted = {};
    //$.each( facets_dict, function( key ) {
    $.each( facet_names, function( key ) {
        let entries = Object.entries(facets_dict[key]);
        //vMessage("Item: " + key + " - " + entries.length);
        //vMessage("Sorting item: " + key + " (" + facet_names[key][0] + ": " + facet_names[key][1]+ " - " + entries.length + ")");
        let sorted = [];
        if (entries.length > 0 && key in facet_names) {
            if (facet_names[key][1] == "show") {
                sorted = entries.sort((a, b) => b[1] - a[1]);
                facets_sorted[key] = sorted;
            }
        } else {
            vMessage("Skipping item: " + key);
        }
    });

    // process the sorted array into the corresponding set of checkbox controls
    $.each( facets_sorted, function( key ) {
        /*
        vMessage("Building checkboxes for: " + key);
        returnHTML = returnHTML + "<div class='facet-block'>";
        returnHTML = returnHTML + "<h2>" + facet_names[key][0] + "</h2>\n";
        //vMessage(value)
        let i = 0;
        $.each( facets_sorted[key], function(item) {
            if (i < 5) {facet_vis = "facet-top"} else {facet_vis = "facet-overflow"};
            returnHTML = returnHTML + "<div class='facet-item " + facet_vis + "'>";
            let itemText = "<input type=\"checkbox\" id=\"" + key + "-" + i + "\" value=\"" + key + "|" + facets_sorted[key][i][0] + "\" name=\"" + facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] + ")\"" + ">\n";
            returnHTML = returnHTML + itemText;
            let itemLabel = "<label for=\"" + key + "-" + i + "\">" + facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] + ")</label><br/>\n";
            returnHTML = returnHTML + itemLabel;
            returnHTML = returnHTML + "</div>";
            //vMessage(itemText);
            i = i + 1;
        })
        returnHTML = returnHTML + "</div>";
        */

        // Filter category title
        returnHTML +=
            "<div class='dropdown'><button class='btn btn-link dropdown-toggle' type='button' id='" +
            key +
            "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> " +
            facet_names[key][0] + "</button>" +
            "<div class='dropdown-menu' aria-labelledby='" + key + "'>";
        returnHTML +=
            "<div class='input-group mb-3'> <div class='input-group-prepend'> <div class='input-group-btn'>";

        let i = 0;
        // Filter category item
        $.each( facets_sorted[key], function(item) {

            /* Before checkbox
            returnHTML += "<a class='dropdown-item' href='#'>" +
                facets_sorted[key][i][0] + " (" + facets_sorted[key][i][1] +
                ")</a>";
            */
            let fski0 = facets_sorted[key][i][0];
            let fski1 = "(" + facets_sorted[key][i][1] + ")";

            returnHTML +=
                "<a class='dropdown-item text-wrap small' href='#'> <input type='checkbox' id='" +
                key + "-" + i + "' value='" + key + "|" + fski0 + "' name='" +
                fski0 + " " + fski1 + "'> " + fski0 + " " + fski1 + "</a>";
            i += 1;
        })
        returnHTML += "</div></div></div></div>";

    });
    //vMessage(returnHTML);
    // return the generated HTML
    //updateActiveFacets()
    $("#results-facets").html(returnHTML);
}

function resultsToHTML() {
    //vMessage("entered resultsToHTML...");
    let results_array = results["results"];
    /* original
    let returnHTML = "<div class=\"result-set\">";

    $.each( results_array, function( index, value) {
        let item_number = index + offset + 1;
        vMessage(item_number + ". " + value.title);
        returnHTML = returnHTML + "\n<div class='result-item'>\n";
        returnHTML = returnHTML + "\n<h3 class='result-title'>" + item_number + ". " + value.title + "</h3>\n";
        returnHTML = returnHTML + "\n<a class='result-url' href='" + value.url + "'>" + value.url + "</a>\n";
        returnHTML = returnHTML + "\n<div class='result-abstract'>" + value.abstract_data + "</div>\n";
        returnHTML = returnHTML + "\n</div>\n";
    });

    returnHTML = returnHTML + "</div>";
    $("#results-searchresult").html(returnHTML);
    */

    $("#results-searchresult").empty();
    $("#results-searchtotal").html ( current_result_count + " results" );

    $.each ( results_array, function ( index, value )
    {
        //vMessage ( value );
        let card = jQuery ( '<div></div>', { "class": "card" } );
        card.appendTo ( '#results-searchresult' );

        let body = jQuery ( '<div></div>', { "class": "card-body" } ).appendTo ( card );

        // title & link
        let title = jQuery ( '<h6></h6>', { "class": "card-title",
            text: index + 1 + ". " } );
        title.appendTo ( body );

        let link = jQuery ( '<a></a>', { "href": value.url,
            text: value.title } );
        link.appendTo ( title );

        // media type; see https://icons.getbootstrap.com/#icons for icons
        if ( typeof value.media_type !== 'undefined' )
        {
            let icon;
            /*
            let svg = jQuery ( '<img>', { "class": "bi", width: "32",
                height: "32", fill: "currentColor",
                text: "<use xlink:href='bootstrap-icons.svg#heart-fill'/>" } );
 // <use xlink:href="bootstrap-icons.svg#heart-fill"/>
 */
            let val = value.media_type;
            vMessage ( "MONA: " + index + " media = " + val );
            if ( val.includes ( "Animation" ) )
                icon = "images/film.svg";
            else if ( val.includes ( "Collection" ) )
                icon = "images/collection.svg";
            else if ( val.includes ( "Event" ) )
                icon = "images/calendar.svg";
            else if ( val.includes ( "Moving Image" ) )
                icon = "images/camera-video.svg";
            else if ( val.includes ( "Presentation" ) )
                icon = "images/person-square.svg";
            else if ( val.includes ( "Text" ) )
                icon = "images/card-text.svg";
            vMessage ( "MONA: icon = " + icon );

            if ( typeof icon !== 'undefined' )
            {
                let media = jQuery ( '<img>', { src: icon,
                    "data-toggle": "tooltip", "title": "Media Type: " + val,
                    width: "16px", hspace: "12" } );
                media.appendTo ( title );
            }
        }

        // license
        if ( typeof value.license !== 'undefined' )
        {
            let icon;
            let val = value.license;
            //vMessage ( "MONA: " + index + " license = " + val );

            if ( val.includes ( "CC BY 2.0" ) )
                icon = "images/cc-by.png";
            else if ( val.includes ( "CC BY-SA 4.0" ) )
                icon = "images/cc-by-sa.png";
            else if ( val.includes ( "CC BY" ) )
                icon = "images/cc-by.png";
            else if ( val.includes ( "YouTube" ) )
                icon = "images/youtube-standard-license_0.png";

            if ( typeof icon !== 'undefined' )
            {
                let license = jQuery ( '<img>', { src: icon,
                    "data-toggle": "tooltip", "title": "License: " + val,
                    style: "width: 12%" } );
                license.appendTo ( title );
            }
        }

        // author
        if ( typeof value.authors[0] !== 'undefined' )
        {
            let subtitle = jQuery ( '<h6>',
                { "class": "card-subtitle font-italic font-weight-lighters pb-1",
                text: "Author #1: " + value.authors[0].givenName + " " +
                value.authors[0].familyName } );
            subtitle.appendTo ( body );
        }
        /* using card showing 3 lines but no "show more" function
        let text = jQuery ( '<p></p>', { "class": "card-text block-with-text",
            html: value.abstract_data } );
        text.appendTo ( body );
        */

        // description; code from https://codepen.io/joserick/pen/ooVPwR
        let summary = jQuery ( '<div></div>', { "class": "result-item-description" } );
        summary.appendTo ( body );

        let description = jQuery ( '<p></p>', { "class": "collapse mb-0",
            id: "desc" + index, html: value.abstract_data } );
        description.appendTo ( summary );

        let collapse = jQuery ( '<a></a>', { "class": "collapsed mb=1",
            "data-toggle": "collapse", href: "#desc" + index,
            "aria-expanded": "false", "aria-control": "collapseSummary" } );
        collapse.appendTo ( summary );
    } );
}

function updateActiveFacets() {
    let returnHTML = "";
    if (Object.keys(search_facets).length > 0) {
        vMessage("Updating facets on page")
        returnHTML = "\nActive Facets:\n<ul>\n"
        Object.entries(search_facets).forEach(([ key, value ]) => {
            for (var item in search_facets[key]) {
                returnHTML = returnHTML + "\n<li>" + key + ": " + search_facets[key][item] + "</li>\n"
            };
        })
        returnHTML = returnHTML + "\n</ul>"
    }
    $("#quick-search-facets").html(returnHTML)
}

// Search functions
function buildSearchJSON() {
    vMessage("Building search JSON for submission to search API from: " + search_string);
    post_content = {"search": []};
    if (search_string != "") {
        post_content.search.push(
            {
                "group": "and",
                "and": [],
                "or": [
                    {"field": "keywords", "string": search_string, "type": "simple"},
                    {"field": "abstract_data", "string": search_string, "type": "simple"},
                    {"field": "title", "string": search_string, "type": "simple"},
                    {"field": "locator_data", "string": search_string, "type": "match"},
                    {"field": "authors.familyName", "string": search_string, "type": "simple"},
                    {"field": "authors.givenName", "string": search_string, "type": "simple"},
                    {"field": "target_audience", "string": search_string, "type": "simple"},
                    {"field": "author_org.name", "string": search_string, "type": "simple"}
                ]
            }
        )
    } else {
        post_content.search.push(
            {
                "group": "and",
                "and": [],
                "or": [
                    {"field": "id", "string": "*", "type": "simple"},
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
    // process facets into the search json if they exist
    vMessage(search_facets)
    vMessage(Object.keys(search_facets).length)
    if (Object.keys(search_facets).length > 0) {
        vMessage("Processing facets")
        let query_array = []
        Object.entries(search_facets).forEach(([key, value]) => {
            for (var item in search_facets[key]) {
                query_array.push({"field": key, "string": search_facets[key][item], "type": "match"})
            };
        })
        post_content.search.push(
            {
                "group": "and",
                "and": query_array
            }
        )
    }
    post_content.limit = limit;
    post_content.offset = offset;
    post_content.sort_str = sort_str;
    vMessage(post_content);
    return post_content;
}

function getResults() {
    vMessage ( "MONA: entered getResults()" );
    search_string = $( "#quick-search-entry" ).val();
    vMessage ( "MONA: search_string = " + search_string );
    buildSearchJSON()
    let searchJSON = post_content;
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
            let errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage)}
    });
}

function processResults(data) {
    // this function should be executed in the context of a successful AJAX request
    vMessage("\n==============\nSuccessfully retrieved results from server - starting processing");
    results = data;
    current_result_returned = results["hits-returned"];
    current_result_count = results["hits-total"];
    vMessage("Returned records in the result set: " + current_result_returned);
    vMessage("Total number of records in result set: " + current_result_count);
    vMessage("\nResults object:")
    vMessage(results);
    //vMessage("\nFacets sub-object:")
    //vMessage(results["facets"]);
    facetsToHTML();
    $(':checkbox').change(function() {
        let facet_value = $(this).val();
        let facet_checked = $(this).is(":checked")
        let pieces = facet_value.split("|");
        let facet = pieces[0];
        let value = pieces[1];
        let content = facet + "(" + facet_checked + "): " + value
        // update facets dictionary to use in search submission
        // if the facet + value is unchecked and is in the current search_facets dictionary remove it
        // if the facet + value  is checked and not in the current search_facets dictionary add it
        vMessage(search_facets)
        if (!facet_checked) {
            vMessage("unchecked processing")
            if (facet in search_facets) {
                const index = search_facets[facet].indexOf(value)
                if (index > -1) {
                    search_facets[facet].splice(index, 1)
                }
                const facet_length = search_facets[facet].length
                vMessage("Facet length: " + facet_length)
                if (facet_length == 0) {
                    delete search_facets[facet]
                }
            }
        } else {
            vMessage("Checked processing")
            if (facet in search_facets) {
                const index = search_facets[facet].indexOf(value)
                if (index == -1) {
                    search_facets[facet].push(value)
                }
            } else {
                search_facets[facet] = [value]
            }
        }
        vMessage("\nsearch_facets object:")
        vMessage(search_facets)
        vMessage(content)
        // execute new search, update results, and associated facets
        // TODO: update checkbox status based on whether or not facet is included in search
        vMessage("Search form triggered by facet change!");
        getResults();
        return false;
    });
    resultsToHTML()
    $("#dump-query").html("<pre>Query JSON: " + JSON.stringify(post_content) + "</pre>")
}

function defaultSearch() {
    vMessage ( "MONA 1" );
    vMessage("Clearing and resubmitting default search!");
    search_facets = {};
    $('input[name=quick-search-entry]').val('');
    getResults();
}

// Event handlers
$( "#quick-search-submit" ).on('click', function () {
    vMessage("Search form triggered!");
    // let ss = $( "#quick-search-entry" ).val();
    // let post_string = buildSearchJSON(ss, facets=search_facets);
    // let post_results = getResults(post_string);
    // processResults(post_results);
    // return false;
    vMessage("Search form triggered!");
    getResults();
    return false;
});

$("#quick-search-entry").on('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        vMessage("Search form triggered!");
        getResults();
        return false
    }

});

$( "#quick-search-clear" ).on('click', function () {
    $('input[name=quick-search-entry]').val('');
    defaultSearch()
    return false;
});

// Handles items per page events
$('.dropdown-item.px-2').on ( 'click', function ( e )
{
    $('#itemsPerPageValue').html ( $(this).text());
    limit = Number ( $(this).text() );
    getResults();
})


// Document Ready code
$( document ).ready(function() {
    // initial data retrieval - get result set
    vMessage("Initial page load finished ...")
    $('[data-toggle="tooltip"]').tooltip() // enable tooltip
    defaultSearch()
    // $.ajax({
    //     "dataType": "json",
    //     "url": startup_request,
    //     "data": {
    //         "limit": 15,
    //         "status": 1},
    //     "success": processResults,
    //     "error": function(){console.log("error")}
    // });
})
