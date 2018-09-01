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
                        backgroundColor: "#47c062",
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
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: true,
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
    }
]);