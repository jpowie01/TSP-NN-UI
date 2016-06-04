var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var startX;
var startY;
var isDown = false;
var dragTarget;

var graph_net_order = [];
var graph_expected_order = [];
var graph_error = 0;
var empty = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];

var circles = [
    {
        "x": 90,
        "y": 225,
        "r": 10,
        "id": 1,
        "color": {
            "r": 255,
            "g": 51,
            "b": 51
        }
    }, {
        "x": 330,
        "y": 90,
        "r": 10,
        "id": 2,
        "color": {
            "r": 255,
            "g": 153,
            "b": 51
        }
    }, {
        "x": 420,
        "y": 225,
        "r": 10,
        "id": 3,
        "color": {
            "r": 51,
            "g": 153,
            "b": 255
        }
    }, {
        "x": 330,
        "y": 370,
        "r": 10,
        "id": 4,
        "color": {
            "r": 255,
            "g": 255,
            "b": 51
        }
    }, {
        "x": 170,
        "y": 370,
        "r": 10,
        "id": 5,
        "color": {
            "r": 153,
            "g": 255,
            "b": 51
        }
    }, {
        "x": 180,
        "y": 90,
        "r": 10,
        "id": 6,
        "color": {
            "r": 219,
            "g": 172,
            "b": 235
        }
    }
];

function createTableForData(container, data, order, color) {
    var table = document.createElement('table');

    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    var header = document.createElement('tr');
    header.appendChild(document.createElement('td'));
    for (var x = 0; x < 6; x++) {
        header.appendChild(document.createElement('td'));
        header.cells[x+1].appendChild(document.createTextNode('Node ' + (x+1).toString()));
        header.cells[x+1].style.fontWeight = 900;
        header.cells[x+1].style.width = '75px';
    }
    table.appendChild(header);

    for (var y = 0; y < 6; y++) {
        var tr = document.createElement('tr');

        tr.appendChild(document.createElement('td'));
        tr.cells[0].appendChild(document.createTextNode((y+1).toString() + '.'));
        tr.cells[0].style.fontWeight = 900;
        for (var x = 0; x < 6; x++) {
            tr.appendChild(document.createElement('td'));
            tr.cells[x+1].appendChild(document.createTextNode(data[x][y].toFixed(4)));
            if (order[y] == x+1) {
                tr.cells[x+1].style.color = color;
            }
        }

        table.appendChild(tr);
    }

    container.appendChild(table);
}

function draw() {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < circles.length; i++) {
        for (var j = 0; j < circles.length; j++) {
            ctx.beginPath();
            ctx.moveTo(circles[i].x, circles[i].y);
            ctx.lineTo(circles[j].x, circles[j].y);
            ctx.stroke();
        }
    }

    if (graph_expected_order.length > 0) {
        for (var i = 0; i < graph_expected_order.length - 1; i++) {
            var a = graph_expected_order[i] - 1;
            var b = graph_expected_order[i+1] - 1;
            ctx.beginPath();
            ctx.moveTo(circles[a].x, circles[a].y);
            ctx.lineTo(circles[b].x, circles[b].y);
            ctx.setLineDash([10, 10]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
			ctx.stroke();
        }
        var a = graph_expected_order[0] - 1;
        var b = graph_expected_order[5] - 1;
        ctx.beginPath();
        ctx.moveTo(circles[a].x, circles[a].y);
        ctx.lineTo(circles[b].x, circles[b].y);
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.setLineDash(0);
    }

    if (graph_net_order.length > 0) {
        for (var i = 0; i < graph_net_order.length - 1; i++) {
            var a = graph_net_order[i] - 1;
            var b = graph_net_order[i + 1] - 1;
            ctx.beginPath();
            ctx.moveTo(circles[a].x, circles[a].y);
            ctx.lineTo(circles[b].x, circles[b].y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
        var a = graph_net_order[0] - 1;
        var b = graph_net_order[5] - 1;
        ctx.beginPath();
        ctx.moveTo(circles[a].x, circles[a].y);
        ctx.lineTo(circles[b].x, circles[b].y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
    }
	
	for (var i = 0; i < circles.length; i++) {
		var circle = circles[i];
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
		ctx.fillStyle = 'rgb(' + circle.color.r + ',' + circle.color.g + ',' + circle.color.b + ')';
		ctx.fill();
		ctx.stroke();
		ctx.strokeText(circle.id, circle.x - 3, circle.y + 3);
    }
}

function hit(x, y) {
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        if (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2) < Math.pow(circle.r, 2))  {
            dragTarget = circle;
            return (true);
        }
    }
    return (false);
}

function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY + $(window).scrollTop());

    // Put your mousedown stuff here
    isDown = hit(startX, startY);
}

function handleMouseUp(e) {
    // Put your mouseup stuff here
    dragTarget = null;
    isDown = false;
}

function handleMouseOut(e) {
    handleMouseUp(e);
}

function handleMouseMove(e) {
    if (!isDown) {
        return;
    }

    graph_net_order = [];
    graph_expected_order = [];
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY + $(window).scrollTop());

    // Put your mousemove stuff here
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    dragTarget.x += dx;
    dragTarget.y += dy;
    calculate();
    createTableForData(document.getElementById('networkResultContainer'), empty, graph_net_order, 'red');
    createTableForData(document.getElementById('expectedResultContainer'), empty, graph_expected_order, 'blue');
}

$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
    handleMouseUp(e);
});
$("#canvas").mouseout(function (e) {
    handleMouseOut(e);
});

function calculate() {
	var graph = {
		"graph": []
	};
	for (var i = 0; i < circles.length; i++) {
		graph.graph.push({
			"x": circles[i].x/500,
			"y": circles[i].y/500,
			"id": circles[i].id
		});
	}
    $.ajax({
        type: "POST",
        url: "http://localhost:5000/tsp/",
        data: JSON.stringify(graph),
        success: function (data) {
            graph_net_order = JSON.parse(JSON.stringify(data.net_order));
            graph_expected_order = JSON.parse(JSON.stringify(data.expected_order));
            console.log(data.net_error);
            graph_error = JSON.parse(JSON.stringify(data.net_error));
            createTableForData(document.getElementById('networkResultContainer'), data.net, graph_net_order, 'red');
            createTableForData(document.getElementById('expectedResultContainer'), data.expected, graph_expected_order, 'blue');
            if (document.getElementById('errorResult').firstChild) {
                document.getElementById('errorResult').removeChild(document.getElementById('errorResult').firstChild);
            }
            document.getElementById('errorResult').appendChild(document.createTextNode(graph_error.toFixed(4)+'%'));
            draw();
        }
    });
}

calculate();
createTableForData(document.getElementById('networkResultContainer'), empty, graph_net_order, 'red');
createTableForData(document.getElementById('expectedResultContainer'), empty, graph_expected_order, 'blue');
