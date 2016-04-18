//simpleControls.js
(function () {
    "use strict";

    angular.module("simpleControls", [])
        .directive("waitCursor", waitCursor);

    function waitCursor() {  
        return { //So the way directives work is they return an object with some well known properties in it.
            templateUrl: "/views/waitCursor.html",  //I have a fragment of a html somewhere that represents what this cursor looks like.
            restrict: "E", // use this directive as only as an Element - not in an attribute
            scope: {  //This ends up being the object that we bind our view directive (wait-cursor too) it's custom attributes and values gets mapped to the internal attributes we declare that will then be used and matched up in the templateView html.
                displayInTemplate: "=displayWhen"  //Left side is scope property & Right side is the custom attribute within the view directive.    
            }
        };
    }
})();