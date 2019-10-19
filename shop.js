
let dropArea = document.getElementById('drop-area');

$('input[type=number]').on('mousewheel', function(e) {
  let field = e.target;
  console.log(e);
  field.value -= Math.floor((e.shiftKey ? 10 : Math.random() * 10) * e.originalEvent.deltaY);
  if (field.value < 0) field.value = 0;
});



function numberInputScroll(e) {
	console.log(e);
}

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.addEventListener(eventName, preventDefaults, false)
})
function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
  document.addEventListener(eventName, highlight, false)
})
;['dragleave', 'drop'].forEach(eventName => {
  document.addEventListener(eventName, unhighlight, false)
})
function highlight(e) {
	document.body.classList.add('highlight');
    dropArea.classList.add('highlight')
}
function unhighlight(e) {
    document.body.classList.remove('highlight');
    dropArea.classList.remove('highlight')
}


dropArea.addEventListener('drop', handleDrop, false)
function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files)
}
function handleFiles(files) {
  ([...files]).forEach(previewFile)
}


function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}


var titles = document.getElementsByClassName('title');
for (var i = 0; i < titles.length; i++) {
	var title = titles[i];
	var split = $(title).html().split("!");
	$(title).html('<div class="flex bg"><div class="empty">' + split[1] + '</div><div class="title1"><div class="title2"><h1>' + 
		split[0] + '</h1></div></div><div class="empty">' + split[2] + '</div><div>');
}




messages = [];
errors = [];

registerLine($('.chat-line'));

function registerLine(selector) {
	selector.on('keypress', function(e) {
		if (e.charCode == 13) {
			e.preventDefault();
			addLineAfter($(this)[0]);
			$(this).next().focus();

		}
	});
	selector.not(".special").on('keydown', function(e) {
		if (e.key == "ArrowUp") {
			e.preventDefault();
			$(this).prev().focus();
		}
		if (e.key == "ArrowDown") {
			e.preventDefault();
			$(this).next().focus();
		}
	});
	selector.on('blur', function(e) {
		blur(e.target);

		// console.log("innerText: " + text + " -> " + e.target.innerText);
		// console.log("innerHTML: " + html + " -> " + e.target.innerHTML);

	});
	selector.on('focus', function(e) {
		let msg = messages[e.target.id];
		e.target.innerText = msg ? msg : "";
	});
}

function blur(target) {
	let text = target.innerText;
	let html = target.innerHTML;
	let t = target.innerText.replace('\n', '');
	messages[target.id] = t;
	if (t) {
		let h = parseMessage(t.replace(/</g, "&lt;").replace(/>/g, "&gt;"), target);
		if (h) target.innerHTML = h;
	}
}

$('#defaultLine1')[0].innerText = "SmaIK: Что мы сегодня будем делать?";
blur($('#defaultLine1')[0]);
$('#defaultLine2')[0].innerText = "MyavkeShop: Генерировать подставы!";
blur($('#defaultLine2')[0]);

var causername = $('#causer-name').html();
getVimePlayer(causername, updateCauser);
function updateCauser(player) {
	if (player) {
		var name = player.username;
		$('#head-first')[0].src="https://skin.vimeworld.ru/head/" + name + ".png";
		$('#head-second')[0].style.backgroundImage='url("https://skin.vimeworld.ru/raw/skin/' + name + '.png';
		$('#head-second')[0].style.background=undefined;
		$('#head-question')[0].hidden = true;
	} else {
		$('#head-first')[0].src=undefined;
		$('#head-second')[0].style.background='#111';
		$('#head-question')[0].hidden = false;
	}
}

function addLineAfter(node) {
	if (node.classList.contains("special")) return;
	var newLine = document.createElement('div');
	newLine.contentEditable = true;
	newLine.classList.toggle('chat-line');
	newLine.id = Math.random();
	console.log(node);
	node.after(newLine);
	registerLine($(newLine));
}


function parseMessage(text, dst) {
	if (dst.classList.contains("special")) {
		let prefix = "";
		getVimePlayer(text, function(player) {
			if (!player) {
				errors[dst.id] = "Не найден";
			} else {
				errors[dst.id] = undefined;
			}
			let displayName;
			if (player) {
				let guildTag = player.guild && player.guild.tag ? "<<span class='color-" + player.guild.color.substring(1) + "'>" + player.guild.tag + "</span>> " : "";
				let rank = ranks[player.rank];
				let playerPrefix = "<span class='color-" + rank.color + "'>" + (rank.prefix ? "[" + (prefix ? prefix : rank.prefix) + "] " : "");
				displayName = guildTag + playerPrefix + player.username;
			} else {
				displayName = "<span class='error' tooltip='" + errors[dst.id] + "'>" + text + "</span>";
			}
			if (errors[dst.id]) dst.classList.add("err");
			else dst.classList.remove("err");
			dst.innerHTML = "<span class='color-7'>" + displayName + "</span></span>";
			updateCauser(player);
		});
		return;
	}
	if (text.includes(': ')) {
		let head = text.substring(0, text.indexOf(': '));
		let name = head;
		let prefix = "";
		let message = parseColors(text.substring(text.indexOf(': ') + 2));
		if (head.includes(' ')) {
			let split = head.split(" ");
			prefix = split[0].replace('[', '').replace(']', '');
			name = split[1];
		}
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) {
			errors[dst.id] = "В нике содержатся некорректные символы.";
			return "<span class='error' tooltip='" + errors[dst.id] + "'>" + name + "</span><span class='color-7'>: </span>" + message;
		} else {
			errors[dst.id] = undefined;
		}
		getVimePlayer(name, function(player) {
			if (!player) {
				errors[dst.id] = "VimeWorld API не нашёл информации по нику " + name;
			} else {
				errors[dst.id] = undefined;
			}
			let displayName;
			let messageColor = "f'>";
			if (player) {
				let guildTag = player.guild && player.guild.tag ? "<<span class='color-" + player.guild.color.substring(1) + "'>" + player.guild.tag + "</span>> " : "";
				let rank = ranks[player.rank];
				let playerPrefix = "<span class='color-" + rank.color + "'>" + (rank.prefix ? "[" + (prefix ? prefix : rank.prefix) + "] " : "");
				displayName = guildTag + playerPrefix + player.username;
				if (rank.isAdmin) messageColor = "a'>";
			} else {
				displayName = "<span class='error' tooltip='" + errors[dst.id] + "'>" + name + "</span>";
			}
			if (errors[dst.id]) dst.classList.add("err");
			else dst.classList.remove("err");
			dst.innerHTML = "<span class='color-7'>" + displayName + "</span>: </span>" + "<span class='color-" + messageColor + message + "</span>";
		});
		return null;
	}
	return text;
}


function parseColors(string) {
	if (!string.includes('&')) return string;
	return "<span>" + string.replace(/&([0-9a-f])/g, "</span><span class='color-$1'>") + "</span>";
}