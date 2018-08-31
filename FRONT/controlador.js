app.controller("controlador", ["$scope", "factory","$http", function ($scope, factory, $http) {

    $scope.leerArchivo = function (archivo) {
        factory.enviarLog(archivo).then(function correcto(response) {
            console.log(response)
            alert("bien")
        }, function error(response) {
            console.log(response)
            alert("mal")
        });
    }



   






$scope.upload = function(){
    // console.log($scope.files);
    
    var archivo = document.getElementById("archivo");;
console.log(archivo)
var file = archivo.files[0];
var url = '@Url.Action("archivo")';
console.log(file)
    // $http.post("http://localhost:3000/upload/", $scope.files,{
    //     headers:{"Content-Type":"multipart/form-data"}
    // })


    // var fd = new FormData();
    // fd.append('file', file);
    // $http.post('http://localhost:3000/upload/hola.pdf', fd, {
    //     transformRequest: angular.identity,
    //     headers: {'Content-Type': undefined}
    // })


    var data = new FormData(this);
    jQuery.each($('input[type=file]')[0].files, function(i, file) {
        data.append('file-'+i, file);
    });
    var other_data = $('form').serializeArray();
    $.each(other_data,function(key,input){
        data.append(input.name,input.value);
    });
    jQuery.ajax({
        url: 'http://localhost:3000/upload/',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
            alert(data);
        }
    });


}

    

}]);