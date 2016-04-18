/// <binding AfterBuild='minify' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var uglify = require("gulp-uglify");
var ngAnnotate = require("gulp-ng-annotate");


//So by definiing the task in cmd line cd to this solution src\TheWorld, and call the definied
//task by typing in '   gulp minify   ' and it will create the all the js files minified under _app folder.
//BUT YOU CAN ALSO  'RIGHT CLICK' on gulpfile.js and do TaskRunnerExplorer to run a defined Task ... before or after a Build!
//e.g, make Task -> minify -> right click  on it 'binding' to After Build' so it runs after a build, uou can see in the task runner explorer when build the results of the task runs when doing a build.
//And then you browsed to lib folder and _app folder appeared with all the minified js files!. 
gulp.task('minify', function () {
    // place code for your default task here
    ////Fluent syntax , like Linq query where method chainging is done (key is never return void but return an object where more readable methods can be called to proceed on the action you want to achieve).
    return gulp.src("wwwroot/js/*.js")  //Get all the javascript in the js folder.
                .pipe(ngAnnotate()) //Don't minify the paramater names (the $http & all other regular service names etc...) in the angular Controller injections, they have to be the same for the injection/ mapping to work.
                .pipe(uglify())  //Take all these js file stream them through a set of tasks, first one is uglify, which will take all the files and minify them.
                .pipe(gulp.dest("wwwroot/lib/_app"));  //After they have been minified save them to destination
});