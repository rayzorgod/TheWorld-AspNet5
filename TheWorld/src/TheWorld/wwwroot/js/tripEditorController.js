(function () {
    "use strict";

    angular.module("app-trips")
    .controller("tripEditorController", tripEditorController);

    function tripEditorController($routeParams, $http) {
        var vm = this;

        vm.tripName = $routeParams.tripName;  //Because if you go into app-trips you will see the routeParams for /editor/:tripName which goes to this controller and passed the vaue as tripName variable.

        vm.name = "Ray";

        vm.stops = [];
        vm.errorMessage = "";
        vm.isBusy = true;
        vm.newStop = {};

        var url = "/api/trips/" + vm.tripName + "/stops"

        $http.get(url)
            .then(function (response) {
                //success
                angular.copy(response.data, vm.stops) //Jquery ajax $.get or angular $http promise if you inspect the call the data comes back as json string formed value pairs...then internal it does a Json.Parse(json represented string) into an javascript object.
                // Then ask angular to copy the response data (creates an exact same instance - deep copy) and puts it to the property of vm.stops.
                //Now there is vm.stops look at tripEditorView.html which is routed and linked to this controller and the vm object, it will have an ng-repeat to display the data in vm.stops.
                _showMap(vm.stops);
            }, function (err) {
                //failure
                vm.errorMessage = "Failed to load stops";
            })
            .finally(function () {
                vm.isBusy = false;
            });

        vm.addStop = function () {
            
            vm.isBusy = true;

            $http.post(url, vm.newStop)  //post just the new stop to the .. api /  StopController.cs Post method
                .then(function (response) {
                    //success
                    vm.stops.push(response.data);
                    _showMap(vm.stops); //recreate the map with all the stops
                    vm.newStop = {}; // to clear out the form.
                }, function (err) {
                    //failure
                    vm.errorMessage = "Failed to add new stop";
                })
                .finally(function () {
                    vm.isBusy = false;
                });
        }
    }

    

    function _showMap(stops) {   //the underscore notation is just to say this is a private function only used in this file.

        if (stops && stops.length > 0) {

            var mapStops = _.map(stops, function (item) {  // _ this is the actual underscore librabry added to trips.cshtml and we are using it map function which is like linq like loop query to go through and change the value returned

                return {
                    lat: item.latitude,
                    long: item.longitude,
                    info: item.name
                };
            });

            //show Map   -- call the travelMap librabry added by Bower...assign it to the #map id div 
            travelMap.createMap({
                stops: mapStops,
                selector: "#map",
                currentStop: 1,
                intialZoom: 3
            });
        }
    };


})();