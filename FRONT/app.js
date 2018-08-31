var app = angular.module('myApp', ['ngRoute'])



/*ENRUTAMIENTO*/
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'src/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .otherwise({ redirectTo: "/home" });

});




app.run([function () {

    var urlServices = "http://localhost";
    var portServices = 3000;

    app.config['urlServicios'] = urlServices + ":" + portServices;
    
}]);