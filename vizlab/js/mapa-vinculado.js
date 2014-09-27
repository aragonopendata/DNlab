(function(){

    d3.json(
	"json/crecimiento_poblacion_comarca.json",
	function (error, json_pob) {
	    if (error) return console.log("Error cargando poblaciones");

	    var colNac;
	    var colExt;
	    var anyos;
	    function actualizarDatosComarca(codComarca) {
		var datosComarca = json_pob
		    .filter(function (e) { return e.c_comarca == codComarca; })
		    .sort(function (a, b) { return parseInt(a.anyo) - parseInt(b.anyo); });

		anyos = datosComarca.map(function (e) { return e.anyo; });
		colNac = ['Nacionales'].concat(datosComarca.map(function (e) { return e.pob_nac_i; }));
		colExt = ['Extranjeros'].concat(datosComarca.map(function (e) { return e.pob_ext_i; }));
	    }

	    var chart;
	    function crearGrafica() {
		// Filtramos los datos de una comarca concreta
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

	    function actualizarGrafica(codComarca) {
		actualizarDatosComarca(codComarca);
		chart.load({
		    columns: [colNac, colExt],
		});
	    }

	    MapaAragon.dibujarMapas(function (e) {
		actualizarDatosComarca(17);
		crearGrafica();
		e.svg.selectAll(".comarcas path").on("click", function (d) {
		    actualizarGrafica(d.properties.c_comarca);
		});
	    });
	}
    );
})();
