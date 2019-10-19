ranks = {
"PLAYER":    rank('', '7'),
"VIP":       rank('V', 'a'),
"PREMIUM":   rank('P', 'b'),
"HOLY":      rank('H', '6'),
"IMMORTAL":  rank('I', 'd'),
"BUILDER":   rank('Билдер', '2'),
"MAPLEAD":   rank('Гл. билдер', '2'),
"YOUTUBE":   rank('You<span class="color-f">Tube</span>', 'c'),
"DEV":       rank('Dev', '3'),
"ORGANIZER": rank('Организатор', '3'),
"MODER":     rank('Модер', '9'),
"WARDEN":    rank('Модер', '9'),
"CHIEF":     rank('Гл. модер', '9',         true),
"ADMIN":     rank('Гл. админ', '3 color-l', true),
}

function rank(prefix, color, isAdmin) {
	return {
		color: color,
		prefix: prefix,
		isAdmin: isAdmin
	}
}


var playerCache = [];

function getVimePlayer(name, callback) {

	// джаваскрипт ты классный конешно но нет, принимает числовые ники за числа и создаёт массив длины 2340942385
	let cached = playerCache["A" + name.toLowerCase()];
	if (cached != undefined) {
		callback(cached == "NOT_FOUND" ? undefined : cached);
		return;
	}
	$.get( "https://api.vime.world/user/name/" + name, function( data ) {
		playerCache["A" + name.toLowerCase()] = data[0] ? data[0] : "NOT_FOUND";
  		callback(data[0]);
	});
}