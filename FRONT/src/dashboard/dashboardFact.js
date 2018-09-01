app.factory("dashboardFact", ["$http", function ($http) {
    var servicio = app.config.urlServicios;

    return {
        getFechaInicioFinLecturas: function () {
            return $http.get(servicio + "/getFechaInicioFinLecturas");
        },
        getCantidadLecturasLeidas: function () {
            return $http.get(servicio + "/getCantidadLecturasLeidas");
        },
        getCantidadLecturasNoLeidas: function () {
            return $http.get(servicio + "/getCantidadLecturasNoLeidas");
        },
        getCantidadDeLecturasPorDia: function () {
            return $http.get(servicio + "/getCantidadDeLecturasPorDia");
        },
    }
}]);