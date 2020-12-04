function foundSymbol(id) {
	for (var i = 0; i < _symbols.length; i++) {
		var s = _symbols[i];
		if (s.id == id) {
			return s;
			break;
		}
	}
	return null;
}

function parseVanguard() {

	var t = '';
	var table = document.getElementById('tableIdddd');

	var rowLength = table.rows.length;

	for (var i = 0; i < rowLength; i += 1) {
		var row = table.rows[i];

		// your code goes here, looping over every row.
		// cells are accessed as easy

		var cellLength = row.cells.length;
		var cells = row.cells;
		if (cells.length < 5) {
			continue;
		}
		t += cells[1].innerText + '\t' + cells[2].innerHTML + '\t'
				+ cells[3].innerHTML.replace(/(?:\r\n|\r|\n)/g, ' ') + '\t'
				+ cells[4].innerHTML + '\n';
	}
	console.log(t);
}
