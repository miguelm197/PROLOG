app.factory("factory", ["$http","$q", function ($http,$q) {
    var servicio = "http://localhost:3000";





    return {
        enviarLog: function (objeto) {
            return $http.post(servicio + "/enviarLog/", objeto);
        }
        


    // asasf
    
    

    }
}]);