////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////				 	Listeners   	 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

$(function(){
	$('#search-summoner').click(function(){
		clearContent();
		pickRandomBackground();
		validateInput();
	}); 
});

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////				 Page Utilities   	 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////
function validateInput(){
	var empty_checker = $('#summoner-name-input');
  	if (!isEmpty(empty_checker)){
		var selected = getSelectedOption();
		//alert(empty_checker + ' | ' + selected);
		if (selected == 'summary'){
			searchSummonerStatsSummary();
		} else {
			searchSummonerStatsRanked();
		}
	}
}

function isEmpty(element){
	var is_empty = false;

	if (element.val() == '' || element.val() == null || element.val() == undefined){
		is_empty = true;
	}

	return is_empty;
}

// Gets the value of the selected radio button
function getSelectedOption(){
	return $('input[name=search-type]:checked').val();
}

// This function simply chooses a random background image to use on the body element
function pickRandomBackground(){
	var image_array = ['bg.jpg','Brand_0.jpg','Blitzcrank_0.jpg','Caitlyn_0.jpg','Heimerdinger_0.jpg','Maokai_0.jpg','MissFortune_0.jpg','Nautilus_0.jpg','Rumble_0.jpg','Warwick_0.jpg','Zyra_0.jpg'];
	var random_bg = image_array[Math.floor(Math.random() * image_array.length)];
	$('body').css('background-image','url("assets/img/' + random_bg + '")');
}

// Resets content in preparation for a new search
function clearContent(){
	$('#output').html('<table class="table table-bordered table-hover" id="stats"><thead></thead><tbody></tbody></table>');
}

// A callback that does nothing
function doNothing(){

}

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////				  API Utilities  	 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

// Fetches value of textbox for summoner name
function getSummonerName(){
	var name = $('#summoner-name-input').val();
	return cleanName(name);
}

// Removes all spaces, makes lower case, and the name is now ready for submission to Riot API
function cleanName(name){
	var low_name = name.toLowerCase();
	var clean_name = low_name.replace(' ', '');
	var trim_name = clean_name.trim();
	return clean_name;
}

// Sends a request to Riot API to get summoner ID by submitting the summoner name
function getSummonerID(callback){
	var name = getSummonerName();
	var summonerID = 'Not Found';

	var API_Response = $.get( 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name + '?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362', function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		summonerID = data[name].id;

		callback(summonerID);
	})
}

// Sets up the visual table to display summoner stats and other data
function buildTable(content_array, callback){
	var stats_table = $('#stats');
	for(var i = 0; i < 15; i++){
		$('#stats thead tr').append('<th id="">' + i + '</th>');
	}
	content_array.forEach(function (element, index) {
		//console.log(element);
		//console.log(index);
		Object.keys(element).forEach(function (sub_element, sub_index) {
		    var sub_el = element[sub_element];
		    //console.log(sub_el);
		    if(typeof sub_el == 'object'){
		    	var cell_count = 0;
		    	$('#stats tbody').append('<tr class="latest-row"></tr>');
		    	Object.keys(sub_el).forEach(function (sub_sub_element, sub_sub_index) {
		   			var sub_sub_el = sub_el[sub_sub_element];
					$('#stats tbody .latest-row').append('<td class="inner-cell">' + Object.keys(sub_el)[sub_sub_index] + ": " + sub_sub_el + '</td>');
					cell_count++;
					if(cell_count % 5 == 0){
						$('#stats tbody .latest-row').removeClass('latest-row');
						$('#stats tbody').append('<tr class="latest-row"></tr>');
					}
				});
				$('#stats tbody .latest-row').removeClass('latest-row');
		    } else {
		    	var highlight_label;
		    	if (Object.keys(element)[sub_index] == 'playerStatSummaryType'){
		    		highlight_label = '<strong>Game Mode</strong>';
		    		sub_el = '<em>' + sub_el + '</em>';
		    	} else if (Object.keys(element)[sub_index] == 'modifyDate'){
		    		sub_el = new Date(sub_el);
		    		sub_el = sub_el.toDateString();
		    		highlight_label = 'Last Played';
		    	} else {
		    		highlight_label = Object.keys(element)[sub_index];
		    	}
				$('#stats tbody').append('<tr><td colspan="15" class="outer-cell">' + highlight_label + ": " + sub_el + '</td></tr>');
			}
		    //console.log(element[sub_index]);
		});
	});	
	callback();
}

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////			Summoner Stats: Summary 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

// This function fetches the stats of the summoner by submitting that person's summoner name (in-game-name)
function getSummonerStatsSummary(callback, id){
	var API_Response = $.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/summary?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362', function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		callback(data);
	})
	.fail(function() {
		alert( "error" );
	})
}

// This function makes 2 separate calls to the Riot API resulting in the game statistics of the player
// The League of Legends term for a player is "summoner"
function searchSummonerStatsSummary(){
	// This is an example of a callback function where it calls the function getSummonerID and 
	// // uses the function getSummonerStats as parameter.
	getSummonerID(function(id){
		getSummonerStatsSummary(function(stats){
			console.log(stats);
			var stats_array = stats['playerStatSummaries'];
			buildTable(stats_array, doNothing);
		}, id);
	});
}

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////			 Summoner Stats: Ranked 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////


// This function fetches the stats of the summoner by submitting that person's summoner name (in-game-name)
function getSummonerStatsRanked(callback, id){
	var API_Response = $.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362', function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		callback(data);
	})
	.fail(function() {
		alert( "error" );
	})
}

// This function makes 2 separate calls to the Riot API resulting in the game statistics of the player
// The League of Legends term for a player is "summoner"
function searchSummonerStatsRanked(){
	// This is an example of a callback function where it calls the function getSummonerID and 
	// // uses the function getSummonerStats as parameter.
	getSummonerID(function(id){
		getSummonerStatsRanked(function(stats){
			console.log(stats);
			var stats_array = stats['champions'];
			buildTable(stats_array, getChampionIDs);
		}, id);
	});
}

////////////////////////////////////////////////////////////////////////
/////////////////										 ///////////////
////////////			 Ranked: Champion Functions 		////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

// This function finds the champion ids in the content of the table.
function getChampionIDs(){
	var stats_table = $('#stats');
	var content = stats_table.html();

	var ids = content.match(/id\: \d*/g);
	ids.splice(ids.indexOf('id: 0'), 1);

	for(var i = 0; i < ids.length; i++){
		var id = cleanChampionID(ids[i]);
		insertChampionName(ids[i], id);
	}

	console.log	(ids);
}

// This function simply removes the 'id: ' part of the id left over from the search
function cleanChampionID(raw_id_text){
	var clean_id = (raw_id_text.replace(/[a-z\:\s]/g, ''));
	//console.log(clean_id + " is now clean!");
	return clean_id;
}

// This function edits the html to display the names of the champions, instead of the champion id #
// Also it's important to note that id: 0 doesn't correspond to a specific champion, it means the combined ranked stats for all champions
function insertChampionName(old_text, champ_id){ 
	//console.log('champ_id = ' + champ_id);
	getChampionName(function(name){
		console.log(name);
		var content = $('#stats').html();
		content = content.replace(old_text, name);
		content = content.replace('id: 0', 'All Ranked Champs');
		$('#stats').html(content);
	}, champ_id);
}

// This function makes an api call to get static data containing champion names by giving the server a champion ID
function getChampionName(callback, id){
	var API_Response = $.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + id + '?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362', function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		var name = data.name;
		callback(name);
	})
	.fail(function() {
		alert( "error" );
	})
}