app.factory("listaLecturasFiltradasFact", ["$http", function ($http) {
    var servicio = app.config.urlServicios;

    return {
        getLecturasFiltradasForTable: function () {
            return $http.get(servicio + "/getLecturasFiltradasForTable");
        },
      
    }
}]);