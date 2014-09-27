/*
 * Biblioteca JS que permite dibujar mapas estáticos sencillos de
 * Aragón, por provincias, comarcas o municipios, y que opcionalmente
 * puede marcar los colegios.
 *
 * Para crear un mapa, basta con poner un 'div' con clase 'mapa' y
 * llamar en un <script> posterior a MapaAragon.dibujarMapas(). Eso
 * creará un mapa de Aragón entero. Se puede concretar con:
 *
 * - data-w: ancho en px
 * - data-h: alto en px
 * - data-clip: si 'false' no se recorta por el contorno
 * - data-provincia: nombre de la provincia para enfocar y filtrar
 * - data-codcomarca: código de la comarca para enfocar y filtrar
 *
 * También se puede poner un callback para hacer más cosas con cada
 * mapa dibujado.
 */

var MapaAragon = (function() {
    var self = {};

    function arrayToObject(a) {
	var o = {};
	for (var i = 0; i < a.length; i++) {
	    o[a[i]] = 1;
	}
	return o;
    }

    /*
      Dibuja un mapa estático y devuelve un objeto con una serie de
      atributos útiles para retoques posteriores.
     */
    self.dibujarMapa = function(elem, json_aragon, json_colegios) {
	var w = parseInt(elem.attr("data-w")) || 400, h = parseInt(elem.attr("data-h")) || 400;
	var clip = elem.attr("data-clip") != "false";

	var svg = elem.append("svg").attr({width: w, height: h});

	// Cargamos las partes del mapa TopoJSON
	var aragon = topojson.feature(json_aragon, json_aragon.objects.aragon);
	var provincias = topojson.feature(json_aragon, json_aragon.objects.provincias);
	var comarcas = topojson.feature(json_aragon, json_aragon.objects.comarcas);
	var municipios = topojson.feature(json_aragon, json_aragon.objects.municipios);

	// Calculamos el enfoque
	var enfoque = aragon;
	var provincia = elem.attr("data-provincia");
	var codcomarca = elem.attr("data-codcomarca");
	if (provincia) {
	    provincias.features = provincias.features.filter(function (e) { return e.properties.PROVINCIA == provincia; });
	    comarcas.features = comarcas.features.filter(function (e) { return e.properties.provincia == provincia; });
	    municipios.features = municipios.features.filter(function (e) { return e.properties.PROVINCIA == provincia; });
	    json_colegios = json_colegios.filter(function (e) { return e.provincia == provincia; });

	    enfoque = provincias.features[0];
	}
	if (codcomarca) {
	    comarcas.features = comarcas.features.filter(function (e) { return e.properties.c_comarca == codcomarca; });
	    municipios.features = municipios.features.filter(function (e) { return e.properties.C_COMARCA == codcomarca; });
	    json_colegios = json_colegios.filter(function (e) { return e.c_comarca == codcomarca; });

	    enfoque = comarcas.features[0];
	}

	// De http://stackoverflow.com/questions/14492284/ //////////

	// Creamos una primera proyección centrada
	var scale  = 1;
	var offset = [0, 0];
	var projection = d3.geo.mercator().scale(scale).translate(offset);
	var path = d3.geo.path().projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	var b = path.bounds(enfoque),
	s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
	t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

	// Update the projection to use computed scale & translate.
	projection.scale(s).translate(t);

	//////////////////////////////////////////////////

	var sCapasSel = elem.attr("data-capas") || "comunidad";
	var capasSel = arrayToObject(sCapasSel.split(","));
	var capas = [];
	if ("municipios" in capasSel) capas.push(["municipios", municipios]);
	if ("provincias" in capasSel) capas.push(["provincias", provincias]);
	if ("comunidad" in capasSel) capas.push(["aragon", aragon]);
	if ("comarcas" in capasSel) capas.push(["comarcas", comarcas]);

	// Dibujamos el clipping path
	if (clip) {
	    svg.append("defs").append("clipPath")
		.attr("id", "clipmapa")
		.append("path").attr("d", path(enfoque));
	}

	// Dibujamos las capas principales
	for (var i = 0; i < capas.length; i++) {
	    var clase = capas[i][0];
	    var datos = capas[i][1];

	    // Dibujamos las provincias
	    var g = svg.append("g").attr("class", clase);
	    if (clip) { g.attr("clip-path", "url(#clipmapa)"); }
	    g.selectAll("path")
		.data(datos.features)
		.enter()
		.append("path")
		.attr("d", path)
		.on("click", function (d) { console.log(d); });
	}

	// Dibujamos los colegios
	if ("colegios" in capasSel) {
	    var g = svg.append("g").attr("class", "colegios");
	    if (clip) {
		g.attr("clip-path", "url(#clipmapa)");
	    }

	    g.selectAll("circle")
		.data(json_colegios)
		.enter()
		.append("circle").attr({
		    "transform": function (d) { return "translate(" + projection([d["lng"], d["lat"]]) + ")"; },
		    "r": 2,
		})
		.on("click", function (d) { console.log(d); })
	    ;
	}

	return {
	    'svg': svg,
	    'aragon': aragon,
	    'provincias': provincias,
	    'comarcas': comarcas,
	    'municipios': municipios,
	    'enfoque': enfoque,
	    'projection': projection,
	    'json_colegios': json_colegios,
	    'json_aragon': json_aragon,
	};
    }

    self.dibujarMapas = function(callback) {
	d3.json("json/aragon.topojson", function (error, json_aragon) {
	    if (error) return console.log('Error cargando TopoJSON', error);

	    d3.json("json/colegios.json", function (error, json_colegios) {
		if (error) return console.log('Error cargando colegios', error);

		var mapas = d3.selectAll(".mapa")[0];
		for (var i = 0; i < mapas.length; i++) {
		    var r = MapaAragon.dibujarMapa(
			d3.select(mapas[i]),
			json_aragon,
			json_colegios
		    );
		    if (callback) {
			callback(r);
		    }
		}
	    });
	});
    };

    return self;
})();
