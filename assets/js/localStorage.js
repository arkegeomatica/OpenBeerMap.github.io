/*
 OpenBeerMap localStorage.js | noemie.lehuby(at)gmail.com, Poilou | MIT Licensed
*/

function get_favorites()
{
    var favoriteBeers = localStorage.getItem('favoriteBeers');
    if(favoriteBeers == "")
    {
        return [];
    }
    else
    {
        return favoriteBeers.split(";");
    }
}

// Onload func
function init_local_storage()
{
    if(localStorage.getItem('favoriteBeers') === null)
    {
        localStorage.clear();
        localStorage.setItem('favoriteBeers', "");
        console.log("INFO: clearing localStorage for new system");
    }

    var favoriteBeers = get_favorites();
    console.log("user has " + favoriteBeers.length + " favorite beer(s): '" + localStorage.getItem('favoriteBeers') + "'");

    update_setup_list(); // displays localStorage items
    update_edit_list(); // update beers list in OSM form
    // Display/update txt notification - debug
    var favoriteBeers = get_favorites();
    document.getElementById('ResultLocalStorage').innerHTML = favoriteBeers.length;
}

//Create the bar edit form in the sidebar
function update_edit_list()
{
    var htmlBeers = '';
    var favoriteBeers = get_favorites();
    for(var i = 0 ; i < favoriteBeers.length ; i++)
    {
        htmlBeers += '<div class="checkbox"><input type="checkbox" name="editBeer" id="editBeersListLocal-' + i + '" value="' + favoriteBeers[i] + '"><label for="editBeersListLocal-' + i + '">' + favoriteBeers[i] + '</label></div>';
    }
    document.getElementById('editBeersListLocal').innerHTML = htmlBeers;
};

//Store items to localStorage
function add_favorite(value)
{
    var favoriteBeers = get_favorites();
    var layer = draw_beer("//overpass-api.de/api/interpreter?data=[out:json];(node(BBOX)[\"brewery\"~\"" + value + "\",i];way(BBOX)[\"brewery\"~\"" + value + "\",i]);out center;", "assets/img/beer1.png");
    if(favoriteBeers.indexOf(value) == -1)
    {
        favoriteBeers.push(value);
        map.addLayer(layer);
    }
    else
    {
        if(map.hasLayer(layer))
        {
            map.removeLayer(layer);
        }
        favoriteBeers.del(value);
        console.log('Removing ' + value + ' from favorite beers');
    }
    localStorage.setItem("favoriteBeers", favoriteBeers.join(";"));
}

// Display the localStorage items
function update_setup_list()
{
    var favoriteBeers = get_favorites();
    if(favoriteBeers.length)
    {
        var list = '';
        for(var i = 0 ; i < favoriteBeers.length ; i++)
        {
            list += '<div><input type="checkbox" checked value="' + favoriteBeers[i] + '" id="setupFavoritesList-' + i + '" /><label for="setupFavoritesList-' + i + '">' + favoriteBeers[i] + '</label></div>';
        }
        $("#setupFavoritesList").html(list);
    }
    else
    {
        document.l10n.localize(['modal_setup_favorites_empty'], function(l10n){
            $("#setupFavoritesList").html('<p class="modal-setup-favorites-empty" data-l10n-id="modal_setup_favorites_empty">' + l10n.entities['modal_setup_favorites_empty'].value + '</p>');
       });
    }
    update_edit_list();
}


// Reset localStorage , uncheck boxes, and remove map layer
function clear_favorites()
{
    var favoriteBeers = get_favorites();
    for(var i = 0 ; i < favoriteBeers.length ; i++)
    {
        var layer = draw_beer("//overpass-api.de/api/interpreter?data=[out:json];(node(BBOX)[\"brewery\"~\"" + favoriteBeers[i] + "\",i];way(BBOX)[\"brewery\"~\"" + favoriteBeers[i] + "\",i]);out center;", "assets/img/beer1.png");
        if(map.hasLayer(layer))
        {
            map.removeLayer(layer);
        }
    }
    localStorage.setItem('favoriteBeers', "");
    update_setup_list();
}

var toBeRemoved = [];

$(document).ready(function(){
   $("#setupClearFavorites").click(function(){
       document.l10n.localize(['modal_setup_confirm_clear'], function(l10n){
            if(confirm(l10n.entities['modal_setup_confirm_clear'].value))
            {
                clear_favorites();
            }
       });
   });
   $("#setupFavoritesList").on("click", "label", function(){
       add_favorite($(this).prev("input").val());
   });

   $("#setupButtonSave").click(function(){
        refresh_layers_list();
        update_edit_list();
   });
});