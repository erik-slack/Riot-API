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

// This function gets the value of the api key box
function getAPIKey(){
	return $('#api-key-input').val();
}

// This function makes sure that the API Key and the Search inputs are not empty
// If they are empty the program won't run
function validateInput(){
	var api_key_input = $('#api-key-input');
	var search_input = $('#summoner-name-input');
  	if (!isEmpty(search_input) && !isEmpty(api_key_input)){
		var selected = getSelectedOption();
		//alert(empty_checker + ' | ' + selected);
		if (selected == 'summary'){
			searchSummonerStatsSummary();
		} else {
			searchSummonerStatsRanked();
		}
	}
}

// A re-usable function for checking if a textbox is empty or not
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

// This function simply chooses a random background image to use on the body top_level_property
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

// Shows an error message in place of the table
function triggerFail(message){
	if(message == undefined){
		message = "Error retrieving information.";
	}

	$("#output").html('<h2 style="color: #FFB3B3; text-shadow: 1px 1px #130707;">' + message + '</h2>');
}

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

	var API_Response = $.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name + '?api_key=' + getAPIKey(), function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		summonerID = data[name].id;

		callback(summonerID);
	})
}

// Sets up the visual table to display summoner stats and other data
function buildTable(content_array, callback){
	var stats_table = $('#stats');

	content_array.forEach(function (top_level_property, index) {
		Object.keys(top_level_property).forEach(function (sub_element, sub_index) {
		    var second_level_property = top_level_property[sub_element];

		    // The 2nd level of properties--or in other words the properies of an object that is set as a property of the top level.
		    if(typeof second_level_property == 'object'){
		    	var cell_count = 0;
		    	$('#stats tbody').append('<tr class="latest-row"></tr>');
		    	Object.keys(second_level_property).forEach(function (sub_sub_element, sub_sub_index) {
		    		// The objects inside of objects and how to handle them.
		   			var third_level_property = second_level_property[sub_sub_element];
					$('#stats tbody .latest-row').append('<td class="inner-cell">' + Object.keys(second_level_property)[sub_sub_index] + ": " + third_level_property + '</td>');
					cell_count++;
					if(cell_count % 5 == 0){
						$('#stats tbody .latest-row').removeClass('latest-row');
						$('#stats tbody').append('<tr class="latest-row"></tr>');
					}
				});
				$('#stats tbody .latest-row').removeClass('latest-row');
		    } else { // If the top level prooperty doesn't equal an object
		    	var highlight_label;
		    	if (Object.keys(top_level_property)[sub_index] == 'playerStatSummaryType'){
		    		highlight_label = '<strong>Game Mode</strong>';
		    		second_level_property = '<em>' + second_level_property + '</em>';
		    	} else if (Object.keys(top_level_property)[sub_index] == 'modifyDate'){
		    		second_level_property = new Date(second_level_property);
		    		second_level_property = second_level_property.toDateString();
		    		highlight_label = 'Last Played';
		    	} else {
		    		highlight_label = Object.keys(top_level_property)[sub_index];
		    	}
				$('#stats tbody').append('<tr><td colspan="15" class="outer-cell">' + highlight_label + ": " + second_level_property + '</td></tr>');
			}
		    //console.log(top_level_property[sub_index]);
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
	var API_Response = $.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/summary?api_key=' + getAPIKey(), function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		callback(data);
	})
	.fail(triggerFail)
}

// This function makes 2 separate calls to the Riot API resulting in the game statistics of the player
// The League of Legends term for a player is "summoner"
function searchSummonerStatsSummary(){
	// This is an example of a callback function where it calls the function getSummonerID and 
	// // uses the function getSummonerStats as parameter.
	getSummonerID(function(id){
		getSummonerStatsSummary(function(stats){
			//console.log(stats);
			var stats_array = stats['playerStatSummaries'];
			if (stats_array){
				buildTable(stats_array, doNothing);
			} else {
				triggerFail('Summoner not found or not enough information exists yet.');
			}
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
	var API_Response = $.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=' + getAPIKey(), function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		callback(data);
	})
	.fail(function(){
		triggerFail("Summoner not found or ranked statistics for it do not exist.");
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
			stats_array.sort();
			stats_array.reverse();
			if (stats_array){
				buildTable(stats_array, getChampionIDs);
			} else {
				triggerFail("Summoner not found or ranked statistics for it do not exist.");
			}
			
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
		//console.log(name);
		name = '<strong>' + name + '</strong>';
		var content = $('#stats').html();
		content = content.replace(old_text, name);
		content = content.replace('id: 0', '<strong>All Ranked Champs</strong>');
		$('#stats').html(content);
	}, champ_id);
}

// This function makes an api call to get static data containing champion names by giving the server a champion ID
function getChampionName(callback, id){
	var API_Response = $.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + id + '?api_key=' + getAPIKey(), function() {
		var data = jQuery.parseJSON(API_Response.responseText);
		var name = data.name;
		callback(name);
	})
	.fail(function() {
		alert( "error" );
	})
}