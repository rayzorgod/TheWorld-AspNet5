(function () {
    "use strict";

    angular.module("app-trips")  //return the app-trips module , create the controller tripscontroller and give it that function tripController
    .controller("tripsController", tripsController);

    function tripsController($http) {

        var vm = this;

        vm.trips = [
                    //{
                    //    name: "World Trip",
                    //    created: new Date()
                    //},
                    //{
                    //    name: "US Trip",
                    //    created: new Date()
                    //} //commented out as get data from server instead.
        ];

        vm.errorMessage = "";

        vm.isBusy = true;  //Before promise we say this isBusy as we are doing a call.
        $http.get("/api/trips") //this http service has also put, post etc. returns a promise.
        .then(function (response) {
            //Success
            angular.copy(response.data, vm.trips); //copies the data into our vm.trips (maps it into it)
            //vm.isBusy = false;  //because it is a promise we would want to mark it if it's busy or not.
        }, function (error) {
            //Failure
            vm.errorMessage = "Failed to load data:" + error;
            //vm.isBusy = false;  //this would work marking like this but it is not very elegant.
        })
        .finally(function () {
            vm.isBusy = false; //Better to do here..bit like try finally block....it will always gets executed at end after everything.
        });

        vm.newTrip = {};

        vm.addTrip = function () {
            //vm.trips.push({ name: vm.newTrip.name, created: new Date() })

            vm.isBusy = true;
            vm.errorMessage = "";

            $http.post("/api/trips", vm.newTrip)
            .then(function (response) {
                //success
                //Interesting when inspected vm.newTrip saw each object had $$hashkey, this is a auto generated key which angular assigns to array,collection passed in ng-repeat directive. And it didn't  have it after the Get request for vm.trips so got confused. Cool sorted. 
                vm.trips.push(response.data); //the data will be the trips object
                vm.newTrip = {};
            }, function () {
                //failure
                vm.errorMessage = "Failed to save new trip";
            })
            .finally(function () {
                vm.isBusy = false;
            });
        };

        
    }
})()