
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


var playerCache = [];

function getVimePlayer(name, callback) {
	let cached = playerCache[name.toLowerCase()];
	if (cached) callback(cached);
	$.get( "https://api.vime.world/user/name/" + name, function( data ) {
		playerCache[name.toLowerCase()] = data[0];
  		callback(data[0]);
	});
}


messages = [];
errors = [];

$('.chat-line').on('focus', function(e) {
	let msg = messages[e.target.id];
	e.target.innerText = msg ? msg : "";
});

$('.chat-line').on('blur', function(e) {
	let t = e.target.innerText.replace('\n', '');
	messages[e.target.id] = t;
	e.target.innerHTML = t ? parseMessage(e.target.innerText, e.target) : ""; 
});

$('.chat-line').on('keypress', function(e) {
	if (e.charCode == 13) {
		e.preventDefault();
		$(this).next().focus();
	}
});


function parseMessage(text, dst) {
	if (text.includes(': ')) {
		let head = text.substring(0, text.indexOf(': '));
		let name = head;
		let prefix = "I";
		let message = text.substring(text.indexOf(': ') + 2);
		if (head.includes(' ')) {
			let split = head.split(" ");
			prefix = split[0].replace('[', '').replace(']', '');
			name = split[1];
		}
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) {
			errors[dst.id] = "В нике " + name + " содержатся некорректные символы.";
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
			let guildTag = player && player.guild && player.guild.tag ? "<<span class='color-" + player.guild.color.substring(1) + "'>" + player.guild.tag + "</span>> " : "";
			let displayName = player ? guildTag + ranks[player.rank].replace('?', prefix) + player.username : 
							"<span class='error' tooltip='" + errors[dst.id] + "'>" + name + "</span>";
			dst.innerHTML = "<span class='color-7'>" + displayName + "</span>: </span>" + message;
		});
	}
	return text;
}