//app-trips.js
(function () {

    "use strict";
    //The module you attach to the ng-app , is responsible for taking care of the page and looking for anything special to do with angular including considering directive that are exposed to it.
    angular.module("app-trips", ["simpleControls", "ngRoute"]) // convention with module, second paramater of an array says we are creating and what should we inject.
        .config(function ($routeProvider) {
            $routeProvider.when("/", {
                controller: "tripsController",
                controllerAs: "vm", //alias which we use for databainding
                templateUrl: "/views/tripsView.html" //Path to the html where the view is held
            });

            $routeProvider.when("/editor/:tripName", { //A variable we can use in the url to pass into the controller
                controller: "tripEditorController",
                controllerAs: "vm", //alias which we use for databainding
                templateUrl: "/views/tripEditorView.html" //Path to the html where the view is held
            });

            $routeProvider.otherwise({redirectTo:"/"});
        }); 

})();