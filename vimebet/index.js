
ADDRESS = "https://implario.cc";

// Добавление ведущих нулей (паддинг)
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}



timeLeft = 60 * 10;
let timerH = $("#timer-h")[0];
let timerM = $("#timer-m")[0];
let timerS = $("#timer-s")[0];
let timerSeparator = $("#timer-separator")[0];

setInterval((h, m, s, sep) => {
	timeLeft--;
	let hrs = timeLeft / 3600;
	let min = (timeLeft % 3600) / 60;
	let sec = timeLeft % 60;

	if (hrs >= 1) {
		h.innerText = Math.floor(hrs).pad(2);
		sep.hidden = false;
	} else {
		h.innerText = "";
		sep.hidden = true;
	}
	m.innerText = Math.floor(min).pad(2);
	s.innerText = Math.floor(sec).pad(2);

}, 1000, timerH, timerM, timerS, timerSeparator);


// $(document).ready(function() {
	data = {
		fund: 220,
		teams: {
			square: {
				name: 'LMAO',
				color: 'ee7777',
				fund: 100,
				players: ['McGrazy', 're1oaded', 'Mistik365', 'Complimentation', 'okayrox', 'Hermitt']
			},
			circle: {
				name: 'Avarice',
				color: 'ee77ee',
				fund: 100,
				players: ['ItzWaffles', 'Appolone_YT', 'eXaaampL', 'Realx', '_Scroll', 'DabMod']
			}
		}
	};
	teams = data.teams;
	fund = 0;

	for (teamId in teams) {
		let team = teams[teamId];
		teamId = "#team-" + teamId + "-";
		$(teamId + "name").text(team.name);
		let teamBody = $(teamId + "body");
		for (var i = 0; i < team.players.length; i++) {
			let name = team.players[i];
			teamBody[0].appendChild(vimeskin(name));
		}
	}

	console.log(data);

// });

vimetopClicked = false;
$("#auth-vimetop").click(function() {
	if (!vimetopClicked) window.open("https://vimetop.ru/auth?app_id=4&key=3ftgyuhf2nj");
	vimetopClicked = true;
});

$("#auth-vimetop-confirm").click(function() {
	let code = $("#auth-vimetop-input").val();
	if (!code) return;
	$.ajax({
		url: ADDRESS + "/auth",
		type: 'POST',
		data: {
			vimetop: code,
		},
		success: console.log
	});
	$.ajax({
		url: ADDRESS + "/user",
		type: 'GET',
		success: console.log
	})
});
