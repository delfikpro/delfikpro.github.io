
// Спасибо https://vime.top <3

let skins = $(".vimeskin");
for (var i = 0; i < skins.length; i++) {
	let name = skins[i].id.substring(5);
	
	let layer1 = document.createElement('img');
	layer1.src = "https://skin.vimeworld.ru/head/" + name + ".png";
	skins[i].appendChild(layer1);

	let layer2 = document.createElement('div');
	kos = layer2;
	layer2.style.backgroundImage = "url('https://skin.vimeworld.ru/raw/skin/" + name + ".png')";
	skins[i].appendChild(layer2);
}

function vimeskin(name) {
	
	let elem = document.createElement('div');
	$(elem).addClass('vimeskin');
	elem.id = 'head-' + name;

	let layer1 = document.createElement('img');
	layer1.src = "https://skin.vimeworld.ru/head/" + name + ".png";
	elem.appendChild(layer1);

	let layer2 = document.createElement('div');
	kos = layer2;
	layer2.style.backgroundImage = "url('https://skin.vimeworld.ru/raw/skin/" + name + ".png')";
	elem.appendChild(layer2);

	return elem;
}

