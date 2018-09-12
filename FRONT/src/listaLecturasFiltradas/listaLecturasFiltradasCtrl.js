app.controller("listaLecturasFiltradasCtrl", ["$scope", "$location", "listaLecturasFiltradasFact", function ($scope, $location, listaLecturasFiltradasFact) {

    $scope.cantidadFilas = 25; //Cantidad de filas a mostrar en la tabla
    $scope.colLecturas = []; //Colección de lecturas obtenidas desde la API
    $scope.lecturasLeidas = []; //Colección de lecturas que se va a mostrar en la tabla
    $scope.totalLecturas = 0; //Cantidad de lecturas de la colección obtenida desde la API
    $scope.totalLecturasF = 0; //Cantidad de lecturas filtradas
    $scope.gruposLecturas = []; //Colección de grupos de lecturas (depende de la cantidad de filas a mostrar)
    $scope.pagTabla = []; //Paginado de la tabla
    $scope.currPag = 1; //Página actual de la tabla
    $scope.antPag = null; //Página anterior a la actual
    $scope.sigPag = 0; //Página siguiente a la actual
    $scope.busPag = false; //Página que se quiere buscar


    listaLecturasFiltradasFact.getLecturasFiltradasForTable().then(function (data) {

        let colLecturas = data.data;
        $scope.colLecturas = colLecturas;

        $scope.totalLecturas = data.data.length;
        $scope.totalLecturasF = $scope.totalLecturas;

        $scope.mostrarGrupoFilas = function (pagina) {


            if (typeof pagina === 'number') {

                $scope.lecturasLeidas = $scope.gruposLecturas[pagina - 1].lecturas;

                let p = pagina;
                let u = $scope.gruposLecturas.length;
                let m = parseInt(u / 2);
                let c = parseInt((p + u) / 2);
                let z = parseInt((p + 1) / 2);
                $scope.pagTabla = [];

                if (u > 5) {
                    if (p == 1) {
                        $scope.pagTabla = [1, 2, 3, "...", c, u];
                    } else

                    if (p > 1 && p < u - 3) {
                        $scope.pagTabla = [p - 1, p, p + 1, "...", c, u];
                    } else

                    if (p > u - 4 && p < u) {
                        $scope.pagTabla = [1, z, "...", p - 1, p, p + 1];
                    } else
                    if (p == u) {
                        $scope.pagTabla = [1, z, "...", p - 2, p - 1, p];
                    }
                } else
                if (u < 5) {
                    for (let i = 1; i <= u; i++) {
                        $scope.pagTabla.push(i);
                    }
                }




                $("#sigPag").removeClass("disabled");
                $("#antPag").removeClass("disabled");
                $("#priPag").removeClass("disabled");
                $("#ultPag").removeClass("disabled");

                if (pagina > u - 1) {
                    $("#sigPag").addClass("disabled");
                }
                if (pagina < 2) {
                    $("#antPag").addClass("disabled");
                }
                if (pagina == 1) {
                    $("#priPag").addClass("disabled");
                }
                if (pagina == u) {
                    $("#ultPag").addClass("disabled");
                }




                $scope.fnAntPag = function () {
                    if ($scope.currPag > 1)
                        $scope.mostrarGrupoFilas($scope.currPag - 1);
                }
                $scope.fnSigPag = function () {
                    if ($scope.currPag < u)
                        $scope.mostrarGrupoFilas($scope.currPag + 1);
                }
                $scope.fnPriPag = function () {
                    if ($scope.currPag > 1)
                        $scope.mostrarGrupoFilas(1);
                }
                $scope.fnUltPag = function () {
                    if ($scope.currPag < u)
                        $scope.mostrarGrupoFilas(u);
                }




                $scope.antPag = $scope.currPag;
                $scope.currPag = pagina;

                $("#" + $scope.antPag).removeClass("active");
                $("#" + pagina).addClass("active");
            }

        }



        $scope.buscarPag = function () {
            let u = $scope.gruposLecturas.length;

            let pag = parseInt($("#inPag").val());
            if (pag > 0 && pag < u) {

                $scope.mostrarGrupoFilas(pag);
                setTimeout(function () {
                    $scope.mostrarGrupoFilas(pag);
                }, 1);
                $scope.busPag = false;
            }

        }

        $scope.$watch("cantidadFilas", function (newValue, oldValue) {
            $scope.currPag = 1;
            $scope.gruposLecturas = agruparFilas(colLecturas);

            $scope.mostrarGrupoFilas($scope.currPag);
            setTimeout(function () {
                $scope.mostrarGrupoFilas($scope.currPag);
            }, 1);
        });



        $scope.$watch("inBusqueda", function (newValue, oldValue) {
            let buscado = ("" + $scope.inBusqueda).toLowerCase();
            let resultB = [];

            if ($scope.inBusqueda) {
                $scope.colLecturas.forEach(lectura => {
                    let inMatricula = lectura.matricula.toLowerCase();
                    let inFecha = lectura.fecha.toLowerCase();

                    if (

                        (inMatricula.indexOf(buscado) >= 0) ||
                        (inFecha.indexOf(buscado) >= 0)

                    ) {
                        resultB.push(lectura);
                    }

                });
                $scope.gruposLecturas = agruparFilas(resultB);
                $scope.mostrarGrupoFilas(1);
                $scope.totalLecturasF = resultB.length;
            } else {
                $scope.gruposLecturas = agruparFilas($scope.colLecturas);
                $scope.mostrarGrupoFilas(1);
            }
        });






    });



    function agruparFilas(colLecturas) {
        let contPag = 0;
        let contLec = 0;
        let grupLec = [{
            grupo: 1,
            lecturas: []
        }];

        colLecturas.forEach(element => {
            if (contLec < $scope.cantidadFilas) {
                grupLec[contPag].lecturas.push(element);
                contLec++;
            } else {
                contPag++;
                contLec = 1;
                grupLec.push({
                    grupo: contPag + 1,
                    lecturas: [element]
                });
            }
        });
        return grupLec;
    }



























}]);