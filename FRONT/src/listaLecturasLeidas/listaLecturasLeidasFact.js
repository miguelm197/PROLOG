app.factory("listaLecturasLeidasFact", ["$http", function ($http) {
    var servicio = app.config.urlServicios;

    return {
        getLecturasLeidasForTable: function () {
            return $http.get(servicio + "/getLecturasLeidasForTable");
        },
      
    }
}]);