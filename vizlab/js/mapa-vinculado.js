(function(){

    // http://stackoverflow.com/questions/4833651/
    function sort_unique(arr) {
	arr = arr.sort(function (a, b) { return a*1 - b*1; });
	var ret = [arr[0]];
	for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
            if (arr[i-1] !== arr[i]) {
		ret.push(arr[i]);
            }
	}
	return ret;
    }

    function GraficaPob(json_pob) {
	var self = {};

	var colNac;
	var colExt;
	var anyos;
	self.actualizarDatosComarca = function(codComarca) {
	    var datosComarca = json_pob
	    if (typeof codComarca !== 'undefined') {
		datosComarca = datosComarca.filter(function (e) { return e.c_comarca == codComarca; });
	    }

	    anyos = sort_unique(datosComarca.map(function (e) { return parseInt(e.anyo); }));
	    datosFiltrados = {};
	    for (var i = 0; i < anyos.length; i++) {
		datosFiltrados[anyos[i]] = {nac: 0, ext: 0};
	    }
	    for (var i = 0; i < datosComarca.length; i++) {
		var d = datosComarca[i];
		var y = d.anyo;

		datosFiltrados[y].nac += d.pob_nac_i;
		datosFiltrados[y].ext += d.pob_ext_i;
	    }

	    colNac = ['Nacionales'].concat(anyos.map(function (y) { return datosFiltrados[y].nac; }));
	    colExt = ['Extranjeros'].concat(anyos.map(function (y) { return datosFiltrados[y].ext; }));
	}

	var chart;
	self.crearGrafica = function() {
	    chart = c3.generate({
		bindto: "#crecPoblacion",
		size: {height: 300, width: 400},
		data: {
		    columns: [colNac, colExt],
		    types: {Nacionales: 'area-spline', Extranjeros: 'area-spline'},
		    groups: [[colNac[0], colExt[0]]],
		},
		axis: {
		    x: {label: 'Año', type: 'category', categories: anyos},
		    y: {label: 'Habitantes'},
		},
	    });
	}

	self.actualizarGrafica = function(codComarca) {
	    self.actualizarDatosComarca(codComarca);
	    chart.load({
		columns: [colNac, colExt],
	    });
	}

	return self;
    }



    function GraficaAlum(json_alum) {
	var self = {};

	var colPub, colPriC, colPriNC;
	var anyos;
	self.actualizarDatosComarca = function(codComarca) {
	    // Filtrar por comarca y ordenar por año
	    var datosComarca = json_alum;

	    if (typeof codComarca !== 'undefined') {
		datosComarca = datosComarca.filter(function (e) { return e.codigo == codComarca; })
	    }

	    anyos = sort_unique(datosComarca.map(function (e) { return parseInt(e.anyo); }));
	    datosFiltrados = {};
	    for (var i = 0; i < anyos.length; i++) {
		datosFiltrados[anyos[i]] = {pub: 0, priC: 0, priNC: 0};
	    }
	    for (var i = 0; i < datosComarca.length; i++) {
		var d = datosComarca[i];
		var y = d.anyo;
		var n = d.alumnado_i;

		if ('Pública' == d.titularidad) {
		    datosFiltrados[y].pub += n;
		}
		else if ('Privado concertado' == d.titularidad) {
		    datosFiltrados[y].priC += n;
		}
		else {
		    datosFiltrados[y].priNC += n;
		}
	    }

	    colPub = ['Pública'].concat(anyos.map(function (y) { return datosFiltrados[y].pub; }));
	    colPriC = ['Privada conc'].concat(anyos.map(function (y) { return datosFiltrados[y].priC; }));
	    colPriNC = ['Privada no conc'].concat(anyos.map(function (y) { return datosFiltrados[y].priNC; }));
	}

	var chart;
	self.crearGrafica = function() {
	    chart = c3.generate({
		bindto: "#alumnado",
		size: {height: 300, width: 400},
		data: {
		    columns: [colPub, colPriNC, colPriC],
		    types: {Pública: 'area-spline', 'Privada no conc': 'area-spline', 'Privada conc': 'area-spline'},
		    groups: [[colPub[0], colPriNC[0], colPriC[0]]],
		},
		axis: {
		    x: {label: 'Año', type: 'category', categories: anyos},
		    y: {label: 'Estudiantes'},
		},
	    });
	}

	self.actualizarGrafica = function(codComarca) {
	    self.actualizarDatosComarca(codComarca);
	    chart.load({
		columns: [colPub, colPriNC, colPriC],
	    });
	}

	return self;
    }

    d3.json(
	"json/crecimiento_poblacion_comarca.json",
	function (error, json_pob) {
	    if (error) return console.log("Error cargando poblaciones");

	    d3.json("json/alumnado_por_comarcas.json", function (error, json_alum) {
		if (error) return console.log("Error cargando alumnos");

		MapaAragon.dibujarMapas(function (e) {
		    var gp = GraficaPob(json_pob);
		    var ga = GraficaAlum(json_alum);

		    gp.actualizarDatosComarca();
		    ga.actualizarDatosComarca();
		    gp.crearGrafica();
		    ga.crearGrafica();

		    e.svg.selectAll(".comarcas path").on("click", function (d) {
			gp.actualizarGrafica(d.properties.c_comarca);
			ga.actualizarGrafica(d.properties.c_comarca);
		    });
		});
	    });

	}
    );
})();
