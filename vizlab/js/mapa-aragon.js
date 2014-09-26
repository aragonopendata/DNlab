(function() {
    var w = 500;
    var h = 500;

    var svg = d3.select("#mapa").append("svg").attr({width: w, height: h});

    d3.json("json/municipios.topojson", function (error, json) {
	if (error) return console.log('Error cargando municipios', error);

	// Cargamos el mapa TopoJSON
	var municipios = topojson.feature(json, json.objects.municipios);

	// Creamos una primera proyección centrada
	var centroid   = d3.geo.centroid(municipios);
	var scale  = 5000;
	var offset = [w/2, h/2];
	var projection = d3.geo.mercator()
	    .center(centroid).scale(scale)
	    .translate(offset)
	;

	// Calculamos los límites X e Y
	var path = d3.geo.path().projection(projection);
	var bounds = path.bounds(municipios);
	var x0 = bounds[0][0];
	var y0 = bounds[0][1];
	var x1 = bounds[1][0];
	var y1 = bounds[1][1];

	// Calculamos la proyección "de verdad"
	var hscale = scale * w / (x1 - x0);
	var vscale = scale * h / (y1 - y0);
	scale  = Math.floor(Math.min(hscale, vscale)) * 0.9;
	offset = [w - (x0 + x1) / 2, h - (y0 + y1)/2];
	projection = d3.geo.mercator()
	    .center(centroid).scale(scale)
	    .translate(offset);
	path = d3.geo.path().projection(projection);

	svg.append("path")
	    .datum(municipios)
	    .attr("d", path);
    });

})();
