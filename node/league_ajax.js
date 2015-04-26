function askSummonerName(){
	var ask = require('readline-sync');
	var name = ask.question('Choose a summoner name to search for: ');
	return cleanName(name);
}

function cleanName(name){
	var low_name = name.toLowerCase();
	var clean_name = low_name.replace(' ', '');
	var trim_name = clean_name.trim();
	return clean_name;
}

function getSummonerID(callback){
	var name = askSummonerName();
	var summonerID = 'Not Found';
	var XMLHttpRequest = require('xhr2');

	var request = new XMLHttpRequest();

	request.open('GET','https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name + '?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362');

	request.onload = function()
	{
		var data = JSON.parse(request.response);
		//console.log(data);
		//console.log(name);
		summonerID = data[name].id;

		callback(summonerID);
	};

	request.send();
}

function getSummonerStats(callback, id){
	var XMLHttpRequest = require('xhr2');

	var request = new XMLHttpRequest();

	request.open('GET','https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/summary?api_key=ed241854-6f2a-4bb1-a63e-f163ef31e362');

	request.onload = function()
	{
	  var data = JSON.parse(request.response);
	  console.log(data);
	  callback(data);
	};

	request.send();
}

function start(){
	getSummonerID(function(id){
		getSummonerStats(function(stats){
			//console.log(stats);
		}, id);
	});
}

start();

/*
$.getJSON("http://api.themoviedb.org/2.1/Movie.search/en/json/23afca60ebf72f8d88cdcae2c4f31866/" + film + "?callback=?", function(json) {
	if (json != "Nothing found."){
		$('#poster').html('<h2 class="loading">Well, gee whiz! We found you a poster, skip!</h2><img id="thePoster" src=' + json[0].posters[0].image.url + ' />');
	} else {
		$.getJSON("http://api.themoviedb.org/2.1/Movie.search/en/json/23afca60ebf72f8d88cdcae2c4f31866/goonies?callback=?", function(json) {
			console.log(json);
			$('#poster').html('<h2 class="loading">We\'re afraid nothing was found for that search. Perhaps you were looking for The Goonies?</h2><img id="thePoster" src=' + json[0].posters[0].image.url + ' />');
		});
	}
});
*/