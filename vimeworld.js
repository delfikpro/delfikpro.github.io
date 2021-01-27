
		function getPlayersCount(iteration, offset) {
			var step = Math.pow(50, iteration);
			console.log("iteration " + iteration + ", starting from " + offset + ", step is " + step);
			var request = guess(offset, step);
			httpGet(request, function find(json) {
				var players = JSON.parse(json);
				// for (var i = 0; i < players.length; i++) {
				// 	console.log(players[i]);
				// }
				if (iteration == 0) {
					var amount = players[players.length - 1].id;
					console.log(amount + " - потрачено " + (Date.now() - startRefreshing) + " мс.");
					document.getElementById("playercount").innerText = amount;
					document.getElementById("pluralshit").innerText = getNoun(amount, "Игрок зарегистрирован", "Игрока зарегистрировано", "Игроков зарегистрировано");
				}
				else getPlayersCount(iteration - 1, offset + (players.length - 1) * step);
			})
		}

		function guess(start, step) {
			var request = "https://api.vime.world/user/";
			for (var i = 0; i < 50; i++) {
				var id = start + i * step;
				request = request + "" + id + ",";
			}
			return request;
		}


		function refreshData() {
			startRefreshing = Date.now();
			getPlayersCount(4, 6250000);
			
		}
		function httpGet(theUrl, callback) {
		    var xmlHttp = new XMLHttpRequest();
		    xmlHttp.onreadystatechange = function() { 
		        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
		            callback(xmlHttp.responseText);
		    }
		    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		    xmlHttp.send(null);
		}
		function getNoun(number, one, two, five) {
		    let n = Math.abs(number);
		    n %= 100;
		    if (n >= 5 && n <= 20) {
		      return five;
		    }
		    n %= 10;
		    if (n === 1) {
		      return one;
		    }
		    if (n >= 2 && n <= 4) {
		      return two;
		    }
		    return five;
		  }
