////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////				 	Listeners   	 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

$(function(){

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

}

// This function makes sure that the API Key and the Search inputs are not empty
// If they are empty the program won't run
function validateInput(){

}

// A re-usable function for checking if a textbox is empty or not
function isEmpty(){

}

// Gets the value of the selected radio button
function getSelectedOption(){

}

// This function simply chooses a random background image to use on the body top_level_property
function pickRandomBackground(){

}

// Resets content in preparation for a new search
function clearContent(){

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
function triggerFail(){

}

// Fetches value of textbox for summoner name
function getSummonerName(){

}

// Removes all spaces, makes lower case, and the name is now ready for submission to Riot API
function cleanName(){

}

// Sends a request to Riot API to get summoner ID by submitting the summoner name
function getSummonerID(){

}

// Sets up the visual table to display summoner stats and other data
function buildTable(){

}

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////			Summoner Stats: Summary 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

// This function fetches the stats of the summoner by submitting that person's summoner name (in-game-name)
function getSummonerStatsSummary(){

}

// This function makes 2 separate calls to the Riot API resulting in the game statistics of the player
// The League of Legends term for a player is "summoner"
function searchSummonerStatsSummary(){
	// This is an example of a callback function where it calls the function getSummonerID and 
	// // uses the function getSummonerStats as parameter.
	
}

////////////////////////////////////////////////////////////////////////
////////														////////
///////////													 ///////////
////////////			 Summoner Stats: Ranked 			////////////
/////////////											   /////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////


// This function fetches the stats of the summoner by submitting that person's summoner name (in-game-name)
function getSummonerStatsRanked(){

}

// This function makes 2 separate calls to the Riot API resulting in the game statistics of the player
// The League of Legends term for a player is "summoner"
function searchSummonerStatsRanked(){
	// This is an example of a callback function where it calls the function getSummonerID and 
	// // uses the function getSummonerStats as parameter.
	
}

////////////////////////////////////////////////////////////////////////
/////////////////										 ///////////////
////////////			 Ranked: Champion Functions 		////////////
////////////////										////////////////
////////////////////////////////////////////////////////////////////////

// This function finds the champion ids in the content of the table.
function getChampionIDs(){

}

// This function simply removes the 'id: ' part of the id left over from the search
function cleanChampionID(){

}

// This function edits the html to display the names of the champions, instead of the champion id #
// Also it's important to note that id: 0 doesn't correspond to a specific champion, it means the combined ranked stats for all champions
function insertChampionName(){

}

// This function makes an api call to get static data containing champion names by giving the server a champion ID
function getChampionName(){

}