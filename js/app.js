var app = angular.module('GroceryList', ["ngRoute"]);

app.config(function ($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/", {
            templateUrl: "views/groceryList.html",
            controller: "HomeController"
        })
        .when("/addItem", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemController"
        })
        .when('/addItem/edit/:id/',{
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemController'
        })
        .otherwise({
            redirectTo: "/"
        })
})

app.service("GroceryService", function($http){
    
    var groceryService = {};

    groceryService.groceryItems = [];

    $http({
      method: 'GET',
      url: 'data/server_data.json'
   }).then(function (response){
        groceryService.groceryItems = response.data;
        for(var item in groceryService.groceryItems){
            
            groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date);
        }
   },function (error){
        alert("Things went wrong!");
   });
    
    groceryService.findById = function(id) 
    {
        for(var item in groceryService.groceryItems)
        {
            if(groceryService.groceryItems[item].id === id)
                return groceryService.groceryItems[item];
        }
    };
    
    groceryService.getNewId = function()
    {
        if(groceryService.newId)
        {
            groceryService.newId++;
            return groceryService.newId;
        }
        else
        {
            var maxId = _.max(groceryService.groceryItems, function(entery){ return entery.id; })
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }
    };
    
    groceryService.markCompleted = function(entry){
        entry.completed = !entry.completed;
    };
    
    groceryService.removeItem = function(entry){
        var index = groceryService.groceryItems.indexOf(entry);
        
        groceryService.groceryItems.splice(index, 1);
    };
    
    groceryService.save = function(entry){
        
        var updatedItem = groceryService.findById(entry.id);
        
        if(updatedItem)
        {
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;
        }
        else
        {
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);    
        }
    };
    return groceryService;
    
});

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService){
    $scope.appTitle = "Grocery List";
    $scope.groceryItems = GroceryService.groceryItems;
    
    $scope.removeItem = function(entry)
    {
        GroceryService.removeItem(entry);
    };
    
    $scope.markCompleted = function(entry){
        GroceryService.markCompleted(entry);
    };
    
    
}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams", "GroceryService", "$location", function($scope, $routeParams, GroceryService, $location){
    
    if(!$routeParams.id)
    {
        $scope.groceryItem = { id:0, completed: false, itemName: "", date: new Date() };
    }
    else
    {
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
    }
    
    $scope.save = function(){
        GroceryService.save( $scope.groceryItem);
        $location.path("/");
    };
    
    console.log($scope.groceryItems);
}]);

app.directive("tbGroceryItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/groceryItem.html"
    }
});