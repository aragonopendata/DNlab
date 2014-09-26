(function() {
    var w = 500;
    var h = 500;

    var svg = d3.select("#mapa").append("svg").attr({width: w, height: h});

    d3.json("json/aragon.topojson", function (error, json) {
	if (error) return console.log('Error cargando TopoJSON', error);

	// Cargamos las partes del mapa TopoJSON
	var aragon = topojson.feature(json, json.objects.aragon);
	var provincias = topojson.feature(json, json.objects.provincias);
	var comarcas = topojson.feature(json, json.objects.comarcas);
	var municipios = topojson.feature(json, json.objects.municipios);

	// De http://stackoverflow.com/questions/14492284/ //////////

	// Creamos una primera proyección centrada
	var scale  = 1;
	var offset = [0, 0];
	var projection = d3.geo.mercator().scale(scale).translate(offset);
	var path = d3.geo.path().projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	var b = path.bounds(aragon),
	s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
	t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

	// Update the projection to use computed scale & translate.
	projection.scale(s).translate(t);

	//////////////////////////////////////////////////

	var capas = [
	    ["municipios", municipios],
	    ["comarcas", comarcas],
	    ["provincias", provincias],
	    ["aragon", aragon],
	];

	// Dibujamos las capas
	for (var i = 0; i < capas.length; i++) {
	    var clase = capas[i][0];
	    var datos = capas[i][1];

	    // Dibujamos las provincias
	    var g = svg.append("g").attr("class", clase);
	    g.selectAll("path")
		.data(datos.features)
		.enter()
		.append("path")
		.attr("d", path)
		.on("click", function (d) { console.log(d); });
	}

	d3.json("json/colegios.json", function(error, colegios) {
	    var g = svg.append("g").attr("class", "colegios");

	    g.selectAll("circle")
		.data(colegios)
		.enter()
		.append("circle").attr({
		    "transform": function (d) { return "translate(" + projection([d["lng"], d["lat"]]) + ")"; },
		    "r": 2,
		})
		.on("click", function (d) { console.log(d); });
	});
    });

})();
