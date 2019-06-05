angular.module("groceryListCtrlModule", [])

.controller("GroceryListCtrl", ["$scope", function($scope){
    
    $scope.anotherobject = {};
    $scope.anotherobject.title = "Main Page";
    $scope.anotherobject.subTitle = "Sub Title";
    $scope.anotherobject.bindoutput = 2;
    $scope.timesTwo = function()
    {
        $scope.anotherobject.bindoutput *= 2;    }
}]);