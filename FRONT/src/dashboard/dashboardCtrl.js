app.controller("dashboardCtrl", ["$scope", "$location", "dashboardFact", function ($scope, $location, dashboardFact) {
    $scope.indicador = {
        lecturasValidas: 0
    };
    $scope.fnLecturasValidas = function(){
        $location.path('/listaLecturasLeidas');
    }
    dashboardFact.getFechaInicioFinLecturas().then(function (data) {
        $scope.indicador.fechaInicio = moment(data.data.fechaInicio).format("DD/MM/YYYY");
        $scope.indicador.fechaFin = moment(data.data.fechaFin).format("DD/MM/YYYY");
    });
    dashboardFact.getCantidadLecturasLeidas().then(function (data) {
        $scope.indicador.lecturasValidas = data.data.cantidadLecturas;
    });
    dashboardFact.getCantidadLecturasNoLeidas().then(function (data) {
        $scope.indicador.lecturasFiltradas = data.data.cantidadLecturas;
    });
    dashboardFact.getCantidadDeLecturasYFiltradasPorDia().then(function (data) {
        let datos = data.data;
        let labels = [];
        let labels2 = [];
        let dataGraf = [];
        let dataGraf2 = [];

        datos.lecturas.forEach(element => {
            labels.push(element.fecha);
            dataGraf.push(element.cantidad);
        });
        datos.filtradas.forEach(element => {
            labels2.push(element.fecha);
            dataGraf2.push(element.cantidad);
        });

        let ctx = document.getElementById("myChart").getContext("2d");
        var lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                        label: "Filtradas",
                        data: dataGraf2,
                        borderColor: "transparent",
                        backgroundColor: "#1b6542e6",
                        pointStyle: "line",
                        lineTension: 0
                    },
                    {
                        label: "Leídas",
                        data: dataGraf,
                        borderColor: "transparent",
                        backgroundColor: "#4bda98e6",
                        pointStyle: "line",
                        lineTension: 0
                    },

                ]
            },
            options: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 13,
                        fontColor: 'gray',
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false,

                        },

                        type: "time",
                        time: {
                            unit: "day",
                            unitStepSize: 2,
                            round: "day",
                            displayFormats: {
                                day: "DD/MM"
                            }
                        },
                        ticks: {
                            display: false,
                            min: 0
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false,
                            color: "#f4f4f4"
                        },

                        ticks: {
                            display: false,
                            min: 0
                        }
                    }]
                }
            }
        });
    });
    dashboardFact.getCantidadFiltros().then(function (data) {
        $scope.filtros = data.data;

        var total = 0;

        $scope.filtros.forEach(element => {
            total = total + element.cantidad;
        });

        $scope.filtros.forEach(element => {
            let porcentaje = (element.cantidad / total) * 100;

            if (element.max) {
                element.max = parseFloat(element.max.toFixed(2));
                element.min = parseFloat(element.min.toFixed(2));
            }

            if (element.promedio)
                element.promedio = element.promedio.toFixed(2);

            element.porcentaje = porcentaje.toFixed(2);
        });

    })




    var speedData = {
        labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
        datasets: [{
            label: "Car Speed",
            data: [0, 59, 75, 20, 20, 55, 40],
        }]
    };

    var chartOptions = {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        }
    };


    let ctx = document.getElementById("graficaFiltros").getContext("2d");
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options: chartOptions
    });




}]);