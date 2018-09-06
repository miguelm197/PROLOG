app.controller("dashboardCtrl", [
    "$scope",
    "$location",
    "dashboardFact",
    function ($scope, $location, dashboardFact) {
        $scope.indicador = {
            lecturasValidas: 0
        };
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
        dashboardFact.getCantidadDeLecturasPorDia().then(function (data) {
            let datos = data.data;
            let labels = [];
            let dataGraf = [];

            datos.forEach(element => {
                labels.push(element.fecha);
                dataGraf.push(element.cantidad);
            });

            let ctx = document.getElementById("myChart").getContext("2d");
            var lineChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataGraf,
                        borderColor: "transparent",
                        backgroundColor: "#4bda98",
                        pointStyle: "line",
                        lineTension: 0
                    }]
                },
                options: {
                    legend: {
                        display: false,
                        position: "",
                        labels: {
                            boxWidth: 100,
                            fontColor: "black"
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: false
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
                                // max: 120,
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
                                // max: 120,
                            }
                        }]
                    }
                }
            });
        });
        dashboardFact.getCantidadFiltros().then(function (data) {
            $scope.filtros = data.data;


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




    }
]);