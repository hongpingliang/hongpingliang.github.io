//https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=I8XFD21STEXL8SBQ

var _TIMESERIS_INTRA_DAY = 1;   
var _TIMESERIS_DAILY = 2;
var _timeSeries = _TIMESERIS_INTRA_DAY;
var _numOfDataPoint = 20;

google.charts.load('current', {
	'packages' : [ 'annotatedtimeline' ]
});
// google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Sold Pencils');
	data.addColumn('number', 'Sold Pens');
	data.addRows([ [ new Date(2008, 1, 1), 30000, 40645 ],
			[ new Date(2008, 1, 2), 14045, 20374 ],
			[ new Date(2008, 1, 3), 55022, 50766 ],
			[ new Date(2008, 1, 4), 75284, 14334 ],
			[ new Date(2008, 1, 5), 41476, 66467 ],
			[ new Date(2008, 1, 6), 33322, 39463 ] ]);

	var chart = new google.visualization.AnnotatedTimeLine(document
			.getElementById('chart_div'));
	chart.draw(data, {
		displayAnnotations : true
	});
}
function init() {
	var t = '';
	t += '<div style="padding-left:5px;">'
	for (var i = 0; i < _symbols.length; i++) {
		var s = _symbols[i];
		
		if ( s.transactions == null || s.transactions.length <= 0 ) {
			if ( !(s.type == 'ETF' || s.category == 'Stock') ) {
				continue;
			}
		}
		
		t += '<a target="_new" style="font-size:120%;" href="http://www.google.com/search?q=stock,' + s.id
		+ '">' + s.id + '</a>';
		t += ' &nbsp; &nbsp;  &nbsp;';
		
		t += '<input type="button" class="btn btn-primary" style="width:75px;"  value="'
			+ 'Trend'
			+ '" onclick="showTrend('
			+ '\''
			+ s.id
			+ '\');"/>';
		
		t += ' &nbsp; &nbsp;  &nbsp;  ';
		
		t += '<input type="button" class="btn btn-primary" style="width:75px;"  value="'
				+ 'Chart" onclick="showStock('
				+ '\''
				+ s.id
				+ '\',' + _TIMESERIS_DAILY + ');"/>';
		
		
//		if ( s.type == 'ETF' || s.type == 'STOCK') {
			t += ' &nbsp; &nbsp;  &nbsp;  ';
			t += '<input type="button" class="btn btn-primary" style="width:75px;"  value="INTRA" onclick="showStock('
				+ '\''
				+ s.id
				+ '\',' + _TIMESERIS_INTRA_DAY + ');"/>';
//		}

		
		t += '<br/>';
		t += '<div style="margin-left:20px;">';
		t += '<span id="trendRoot_' + s.id + '"></span>';
		t += s.name
		t += '&nbsp; &nbsp; ';
		
		t += '<br/>'
		t += s.category + ' ' + s.expense;
		
		if ( s.transactions != null && s.transactions.length > 0 ) {
			t += '<br>';
			
			for (var j=0; j<s.transactions.length; j++) {
				var trans = s.transactions[j];				
				t += ' &nbsp; ' + trans.date + ' ' + trans.type + ' $' + trans.price + ' ' + trans.share + ' $' + (trans.price * trans.share).toFixed(2);  
				t += '  ' + trans.note;
				t += '<br/>';
			}			
			
			t += '<input type="button" class="btn btn-primary" style="width:75px;"  value="Check" onclick="loadCurrentPrice('
				+ '\''
				+ s.id
				+ '\');"/>';
			t += '<div id="priceRoot_' + s.id + '"></div>';
		}
		t += '</div>';
		t += '<div id="displayRoot_' + s.id + '"></div>';
		t += '<br/><br/>'
			
	}
	t += '</div>'
	
	$('#symbolList').html(t);
}

function checkPrice() {
	for (var i = 0; i < _symbols.length; i++) {
		var s = _symbols[i];
		if ( s.transactions == null || s.transactions.length < 1 ) {
			continue;
		}
		loadCurrentPrice(s.id);
	}
}

function loadCurrentPrice(symbol) {
	var url = 'https://www.alphavantage.co/query?apikey=I8XFD21STEXL8SBQ&function=';
	url += 'GLOBAL_QUOTE&interval=5min';
	url += '&symbol=' + symbol;
	console.log(url);
	$.ajax({
		url : url,
		dataType : 'json',
		data : null,
		success : function(result) {
			onLoadCurrentPrice(result);
		},
		fail : null
	});
}
function onLoadCurrentPrice(result) {
	if (result == null || result['Global Quote'] == null) {
		return;
	}
	var ret = result['Global Quote'];
	var symbol = ret['01. symbol'];
	var price = ret['05. price']*1.0;
	var prevClose = ret['08. previous close']*1.0;
	var date = ret['07. latest trading day'];

	var t = '';
	t += symbol + ' $' + price.toFixed(2) + '  &nbsp; ' + date;
	t += '<br/>';
	
	var s = foundSymbol(symbol);
	for (var j=0; j<s.transactions.length; j++) {
		var trans = s.transactions[j];
		var change = (price-trans.price) * trans.share;
		var style = '';
		if ( change > 0 ) {
			style = 'style="color:green;"';
		} else {
			style = 'style="color:red;"';
		}
		t += '$' + trans.price.toFixed(2) + ' &nbsp; <span ' + style + '>$' + change.toFixed(2) + ' ' + (price-trans.price).toFixed(2)  + ' </span>';
		
		t += ' &nbsp; ' + trans.date + ' ' + trans.type + ' $' + trans.price + ' ' + trans.share + ' $' + (trans.price * trans.share).toFixed(2);  
		t += '  ' + trans.note;
		t += '<br/>';
	}	
	
	$('#priceRoot_' + symbol).html(t);
}

function showInputStock() {
	$('#showInputDisplayRoot').html('');
	var symbols = document.getElementById('symbols').value.split(' ');
	for (var i = 0; i < symbols.length; i++) {
		var symbol = symbols[i];
		$('#showInputDisplayRoot').append(
				'<div id="displayRoot_' + symbol +'"></div>');
		showStock(symbol, _TIMESERIS_INTRA_DAY);
	}
}

function showTrend(symbol) {
	var url = 'https://www.alphavantage.co/query?apikey=I8XFD21STEXL8SBQ&function=';
	url += 'TIME_SERIES_DAILY&outputsize=compact';
	url += '&symbol=' + symbol;
	console.log(url);
	$.ajax({
		url : url,
		dataType : 'json',
		data : null,
		success : function(result) {
			onShowTrendReady(result);
		},
		fail : null
	});
}
function onShowTrendReady(result) {
	var days = document.getElementById('trendLength').value * 1;
	
	if (result == null || result['Meta Data'] == null) {
		return;
	}
	var symbol = result['Meta Data']['2. Symbol'];
	var timeKey;
	for ( var n in result) {
		if (n.startsWith('Time Series')) {
			timeKey = n;
			break;
		}
	}

	var series = result[timeKey];
	var data = [];
	var cnt = 0;
	for ( var time in series) {
		var open = series[time]['1. open'] * 1.0;
		var close = series[time]['4. close'] * 1.0;
		
		
		var obj = new Object();
		obj.time = time;
		obj.open = open;
		obj.close = close;
		data.push(obj);
		
//		if (cnt > _numOfDataPoint) {
		if (cnt > days) {	
			break;
		}
		cnt++;
	}
	
	data = data.reverse();
	showChangeAtNight(symbol, data);
}

function showChangeAtDay(symbol, data) {
	var lastIndex = data.length-1;

	var t = '<div>';
	t += _numOfDataPoint + ' Days: ';
	t += '<span style="font-size:120%;font-weight:bold;">';
	t += '$' + (data[lastIndex].close - data[0].close).toFixed(2);
	t += '</span>'
	t += '<br/>'
		
	t += '<div class="row" style="text-align:center;">';
	var d = '<div class="row" style="text-align:center;font-size:55%;">';
	var c = '<div class="row" style="text-align:right;font-size:80%;padding-left:10px;">';
	for (var i=0; i<=lastIndex; i++ ) {
		var curr = data[i].open;
		var next = data[i].close;
		console.log(curr + ' ' + next)
		//t += '<span style="padding-left:6px;padding-right:6px;background-color:';
		t += '<div class="col-xs-1" style="background-color:';
		if ( curr == next ) {
			t += 'gray';
		} else if (curr > next ) {
			t += 'red';
		} else {
			t += 'green';
		}
		t += ';">' + data[i].time.substring(8);
		t += '</div>';
		d += '<div class="col-xs-1">';
		d += '$' + data[i].close;
		d += '</div>';
		
		c += '<div class="col-xs-1">';
		c += (next-curr).toFixed(2);
		c += '</div>';
	}
	t += '<div class="col-xs-1"></div>';
	t += '</div>'
		
	d += '<div class="col-xs-1">';
	d += '$' + data[lastIndex].close;
	d += '</div>';
	d += '</div>';
	
	c += '</div>';
	
	t += d;
	t += c;
	t += '</div>'
	
	
	$('#trendRoot_' + symbol).html(t);
}

function showChangeAtNight(symbol, data) {
	var lastIndex = data.length-1;

	var t = '<div>';
	t += _numOfDataPoint + ' Days: ';
	t += '<span style="font-size:120%;font-weight:bold;">';
	t += '$' + (data[lastIndex].close - data[0].close).toFixed(2);
	t += '</span>';
	t += ' (' + data[0].close.toFixed(2) + ' - ' + data[lastIndex].close.toFixed(2) + ')'
	t += '<br/>'
		
	t += '<div class="row" style="text-align:center;">';
	var d = '<div class="row" style="text-align:center;font-size:55%;">';
	var c = '<div class="row" style="text-align:right;font-size:80%;padding-left:10px;">';
	for (var i=0; i<lastIndex; i++ ) {
		var curr = data[i].close;
		var next = data[i+1].close;
		//t += '<span style="padding-left:6px;padding-right:6px;background-color:';
		t += '<div class="col-xs-1" style="background-color:';
		if ( curr == next ) {
			t += 'gray';
		} else if (curr > next ) {
			t += 'red';
		} else {
			t += 'green';
		}
		t += ';">' + data[i].time.substring(8);
		t += '</div>';
		d += '<div class="col-xs-1">';
		d += '$' + data[i].close;
		d += '</div>';
		
		c += '<div class="col-xs-1">';
		c += (next-curr).toFixed(2);
		c += '</div>';
	}
	t += '<div class="col-xs-1"></div>';
	t += '</div>'
		
	d += '<div class="col-xs-1">';
	d += '$' + data[lastIndex].close;
	d += '</div>';
	d += '</div>';
	
	c += '</div>';
	
	t += d;
	t += c;
	t += '</div>'
	
	
	$('#trendRoot_' + symbol).html(t);
}

function showStock(symbol, timeSeries) {
	_timeSeries = timeSeries;
	var chartId = _timeSeries + '_' + symbol;
	var t = '';
	t += '<br/><div id="note_' + chartId + '"></div>';
	t += '<br/><div id="chart_'
			+ chartId
			+ '" style="width: 100%; height: 240px;padding-right:20px;"></div><br/>';

	$('#displayRoot_' + symbol).html(t);
	loadStock(symbol);
}

function loadStock(symbol) {
	var url = 'https://www.alphavantage.co/query?apikey=I8XFD21STEXL8SBQ&function=';
	if (_timeSeries == _TIMESERIS_INTRA_DAY) {
		url += 'TIME_SERIES_INTRADAY&interval=5min';
	} else if (_timeSeries == _TIMESERIS_DAILY) {
		url += 'TIME_SERIES_DAILY&outputsize=compact';
	}
	url += '&symbol=' + symbol;
	console.log(url);
	$.ajax({
		url : url,
		dataType : 'json',
		data : null,
		success : function(result) {
			onLoadStock(result);
		},
		fail : null
	});
}
function onLoadStock(result) {
	if (result == null || result['Meta Data'] == null) {
		return;
	}

	var symbol = result['Meta Data']['2. Symbol'];
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	// data.addColumn('timeofday', 'Date');

	data.addColumn('number', symbol);
	// datetime
	var dataRows = [];

	var timeKey;
	for ( var n in result) {
		if (n.startsWith('Time Series')) {
			timeKey = n;
			break;
		}
	}
	if (_numOfDataPoint < 0) {
		_numOfDataPoint = 30;
	}

	var cnt = 0;
	var priceBegin, priceEnd;
	var series = result[timeKey];
	for ( var time in series) {
		// console.log(time + ' ' + series[time]['4. close'])
		var dr = [];
		dr.push(new Date(time));
		var close = series[time]['4. close'] * 1.0;
		if (cnt == 0) {
			priceEnd = close;
		}
		priceBegin = close;
		cnt++;

		console.log(time + ' ' + priceEnd + ' ' + priceBegin)

		dr.push(close);
		dataRows.push(dr);

		if (time.indexOf('09:35:00') > 0) {
			break;
		}

		if (_timeSeries == _TIMESERIS_DAILY && cnt > _numOfDataPoint) {
			break;
		}
	}

	// console.log(dataRows);
	data.addRows(dataRows);
	var chartId = _timeSeries + '_' + symbol;
	var change = (priceEnd - priceBegin);
	var color;
	if (priceEnd > priceBegin) {
		color = 'green';
	} else {
		color = 'red';
	}
	$('#note_' + chartId).append(
			'<span style="font-size:120%;color:' + color + '">'
					+ priceEnd.toFixed(2) + ' - ' + priceBegin.toFixed(2)
					+ ' = ' + change.toFixed(2) + '</span>');

	var chart = new google.visualization.AnnotatedTimeLine(document
			.getElementById('chart_' + chartId));

	var options = {
		displayAnnotations : true,
		dateFormat : 'MM-dd',
		hAxis : {
			format : 'short'
		}
	};

	chart.draw(data, options);
}

function redraw() {
	var url = 'symbolServlet?';
	$("input[name='symbols']:checked").each(function() {
		url += '&symbols=' + this.value;
	});
	console.log(url);

	// url = 't.json';

	$.ajax({
		url : url,
		dataType : 'json',
		data : null,
		success : function(result) {
			onRedrawReady(result);
		},
		fail : null
	});
}
function onRedrawReady(result) {
	console.log(result);
	if (result == null) {
		return;
	}
	if (result.headers == null || result.chartData == null) {
		return;
	}

	var data = new google.visualization.DataTable();
	for (var i = 0; i < result.headers.length; i++) {
		var h = result.headers[i];
		data.addColumn(h.type, h.label);
	}

	console.log(result.chartData);
	var dataRows = [];
	for (var i = 1; i < result.chartData.length; i++) {
		var row = result.chartData[i];

		var dr = [];
		dr.push(new Date(row[0] * 1));

		for (var j = 1; j < row.length; j++) {
			dr.push(row[j] * 1.0)
		}
		dataRows.push(dr);
	}
	console.log(dataRows);

	data.addRows(dataRows);

	var chart = new google.visualization.AnnotatedTimeLine(document
			.getElementById('chart_div'));
	chart.draw(data, {
		displayAnnotations : true
	});

}

function initCSV() {
	$.get("data/own.csv", function(cvsString) {
		var cvsData = $.csv.toArrays(cvsString, {
			onParseValue : $.csv.hooks.castToScalar
		});
		if (cvsData == null || cvsData.length < 2) {
			console.log(cvsString);
			return;
		}
		parseData(cvsData);
	});
}

function parseData(cvsData) {
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	var header = cvsData[0];
	for (var i = 1; i < header.length; i++) {
		data.addColumn('number', header[i]);
	}

	var dataRows = [];
	for (var i = 1; i < cvsData.length; i++) {
		var cvsRow = cvsData[i];

		var dParts = cvsRow[0].split('-');
		var date = new Date(dParts[0] * 1, dParts[1] * 1 - 1, dParts[2] * 1 - 1)

		// var date = Date.parse(cvsRow[0]+'T14:48:00');
		// console.log(date)

		var dr = [];
		dr.push(date);

		for (var j = 1; j < cvsRow.length; j++) {
			dr.push(cvsRow[j] * 1.0)
		}

		dataRows.push(dr);
	}
	data.addRows(dataRows);

	console.log(data)

	var chart = new google.visualization.AnnotatedTimeLine(document
			.getElementById('chart_div'));
	chart.draw(data, {
		displayAnnotations : true
	});
}

function setNumOfDataPoint(numOfDataPoint) {
	_numOfDataPoint = numOfDataPoint;
}
function setTimeSerie(timeSeries) {
	_timeSeries = timeSeries;
}
