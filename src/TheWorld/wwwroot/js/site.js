//site.js
(function () {

    var ele = $("#username");
    ele.text("Raymond Bennett");

    var main = $("#main");
    main.on("mouseenter", function () {
      //  main.attr('style', 'background-color: #808080');
        //main.css("background-color", "#808080");
    });

    main.on("mouseleave", function () {
       // main.attr('style', 'background-color: none');
    });

    //var menuItems = $("ul.menu li a");
    //menuItems.on("click", function () {
    //    var me = $(this);
    //    alert(me.text());
    //})

    var $sidebarAndWrapper = $("#sidebar,#wrapper");
    var $icon = $("#sidebarToggle i.fa");

    $("#sidebarToggle").on("click", function () {
        $sidebarAndWrapper.toggleClass("hide-sidebar");
        if ($sidebarAndWrapper.hasClass("hide-sidebar")) {
            //$(this).text("Show Sidebar");
            $icon.removeClass("fa-angle-left");
            $icon.addClass("fa-angle-right");
        }
        else {
            //$(this).text("Hide Siderbar");
            $icon.removeClass("fa-angle-right");
            $icon.addClass("fa-angle-left");
        }
    });
})();