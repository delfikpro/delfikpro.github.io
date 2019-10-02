
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




messages = [];
errors = [];

$('.chat-line').on('focus', function(e) {
	let msg = messages[e.target.id];
	e.target.innerText = msg ? msg : "";
});

$('.chat-line').on('blur', function(e) {
	let text = e.target.innerText;
	let html = e.target.innerHTML;
	let t = e.target.innerText.replace('\n', '');
	messages[e.target.id] = t;
	if (t) {
		let h = parseMessage(t.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e.target);
		if (h) e.target.innerHTML = h;
	}


	console.log("innerText: " + text + " -> " + e.target.innerText);
	console.log("innerHTML: " + html + " -> " + e.target.innerHTML);

});


$('.chat-line').on('keypress', function(e) {
	if (e.charCode == 13) {
		e.preventDefault();
		$(this).next().focus();
	}
});

$('.chat-line').on('keydown', function(e) {
	if (e.key == "ArrowUp") {
		e.preventDefault();
		$(this).prev().focus();
	}
	if (e.key == "ArrowDown") {
		e.preventDefault();
		$(this).next().focus();
	}
});


function parseMessage(text, dst) {
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