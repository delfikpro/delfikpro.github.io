for (var i = 0; i <= form.code.value.length; i++) {
	var field = document.getElementById("q" + (i+1));
	switch (form.code.value[i]) {
		case "v":
			var range = 10000;
		    for (var ans = 0; ans <= range * 2; ans++) {
		        form["a"+(i+1)].value = ((ans % 2 == 0) ? ans : -ans) >> 1;
		        if (checkInt("a"+ (i + 1)) != 0) break;
		    }
		case "c":
		case "r":
			var boxes = form["a" + (i + 1)];
			for (var id = 0; id < boxes.length; id++) {
				boxes[id].checked = boxes[id].value == 1;
			}
		

	}

}