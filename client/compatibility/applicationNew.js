// FLAT Theme v2.0



function checkLeftNav() {
    var $w = $(window),
        $content = $("#content"),
        $left = $("#left");
    if ($w.width() <= 840) {
        if (!$left.hasClass("mobile-show")) {
            $left.hide();
            $("#main").css("margin-left", 0);
        }
        if ($(".toggle-mobile").length == 0) {
            $("#navigation .user").before('<a href="#" class="toggle-mobile"><i class="fa fa-bars"></i></a>');
        }

        if ($(".mobile-nav").length == 0) {
            createSubNav();
        }
    } else {
        if (!$left.is(":visible") && !$left.hasClass("forced-hide") && !$("#content").hasClass("nav-hidden")) {
            $left.show();
            $("#main").css("margin-left", $left.width());
        }

        $(".toggle-mobile").remove();
        $(".mobile-nav").removeClass("open");

        if ($content.hasClass("forced-fixed")) {
            $content.removeClass("nav-fixed");
            $("#navigation").removeClass("navbar-fixed-top");
        }

        if ($w.width() < 1200) {
            if ($("#navigation .container").length > 0) {
                versionFluid();
                $('body').addClass("forced-fluid");
            }
        } else {
            if ($('body').hasClass("forced-fluid")) {
                versionFixed();
            }
        }
    }
}


function toggleMobileNav() {
    var mobileNav = $(".mobile-nav");
    mobileNav.toggleClass("open");
    mobileNav.find(".open").removeClass("open");
}

function getNavElement(current) {
    var currentText = $.trim(current.find(">a").text()),
        element = "";
    element += "<li><a href='" + current.find(">a").attr("href") + "'>" + currentText + "</a>";
    if (current.find(">.dropdown-menu").length > 0) {
        element += getNav(current.find(">.dropdown-menu"));
    }
    element += "</li>";
    return element;
}

function returnPersonalMenu() {
    var _menu = '<li><a href="#">Personal menu</a><ul>';
    var _links = [

        {
            link: "/myProfile",
            name: "My Profile"
        },
        {
            link: "/calendar",
            name: "Repetitions Calendar"
        },
        {
            link: "/messageCenter",
            name: "Message center"
        },
        {
            link: "/notificationCenter",
            name: "Notification center"
        }
    ]
    _links.forEach(function (link) {
        _menu += '<li><a href="' + link.link + '">' + link.name + '</a></li>';
    })
    _menu += '</ul></li>';
    _menu += '<li><a class="logOut" href="javascript:">Logout</a></li>';
    return _menu;
}

var nav = "";
function getNav(current) {
    var currentNav = "";
    currentNav += "<ul>";
    current.find(">li").each(function () {
        currentNav += getNavElement($(this));
    });
    currentNav += "</ul>";
    nav = currentNav;
    return currentNav;
}
function getMainNav(current) {
    var currentNav = "";
    currentNav += "<ul>";
    current.find(">li").each(function () {
        currentNav += getNavElement($(this));
    });
    currentNav += returnPersonalMenu();
    currentNav += "</ul>";
    nav = currentNav;
    return currentNav;
}

function createSubNav() {
    if ($(".mobile-nav").length == 0) {
        var original = $("#navigation .main-nav");
        // loop
        var current = original;
        getMainNav(current);
        $("#navigation").append(nav);
        $("#navigation > ul").last().addClass("mobile-nav");

        $(".mobile-nav > li > a").click(function (e) {
            var el = $(this);
            $("#navigation").getNiceScroll().resize().show();
            if (el.next().length !== 0) {
                e.preventDefault();

                var sub = el.next();
                el.parents(".mobile-nav").find(".open").not(sub).each(function () {
                    var t = $(this);
                    t.removeClass("open");
                    t.prev().find("i").removeClass("icon-angle-down").addClass("icon-angle-left");
                });
                sub.toggleClass("open");
                el.find("i").toggleClass('icon-angle-left').toggleClass("icon-angle-down");
            }
        });
    }
}

function hideNav() {
    $("#left").toggle().toggleClass("forced-hide");
    if ($("#left").is(":visible")) {
        $("#main").css("margin-left", $("#left").width());
    } else {
        $("#main").css("margin-left", 0);
    }

    if ($('.dataTable').length > 0) {
        var table = $.fn.dataTable.fnTables(true);
        if (table.length > 0) {
            $(table).each(function () {
                if ($(this).hasClass("dataTable-scroller")) {
                    $(this).dataTable().fnDraw();
                }
                $(this).css("width", '100%');
            });
            $(table).dataTable().fnAdjustColumnSizing();
        }
    }

    if ($(".calendar").length > 0) {
        $(".calendar").fullCalendar("render");
    }
}


$(document).ready(function () {

//    checkLeftNav();

    $(".gototop").click(function (e) {
        e.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, 600);
    });

    if ($("body").attr("data-mobile-sidebar") == "slide") {
        $("body").touchwipe({
            wipeRight: function () {
                $("#left").show().addClass("mobile-show");
                initSidebarScroll();
            },
            wipeLeft: function () {
                $("#left").hide().removeClass("mobile-show");
            },
            preventDefaultEvents: false
        });
    }

    createSubNav();

    $("#navigation").on('click', '.toggle-mobile', function (e) {
        e.preventDefault();
        toggleMobileNav();
    });


    $(".custom-checkbox").each(function () {
        var $el = $(this);
        if ($el.hasClass("checkbox-active")) {
            $el.find("i").toggleClass("fa-square-o").toggleClass("fa-check-square-o");
        }
        $el.bind('click', function (e) {
            e.preventDefault();
            $el.find("i").toggleClass("fa-square-o").toggleClass("fa-check-square-o");
            $el.toggleClass("checkbox-active");
        });
    });

    $(".toggle-subnav").click(function (e) {
        e.preventDefault();
        var $el = $(this);
        $el.parents(".subnav").toggleClass("subnav-hidden").find('.subnav-menu,.subnav-content').slideToggle("fast");
        $el.find("i").toggleClass("icon-angle-down").toggleClass("icon-angle-right");

        if ($("#left").hasClass("mobile-show") || $("#left").hasClass("sidebar-fixed")) {
            getSidebarScrollHeight();
            $("#left").getNiceScroll().resize().show();
        }
    });


    $("[rel=popover]").popover();

    $('.toggle-nav').click(function (e) {
        e.preventDefault();
        hideNav();
    });

    if ($("#content").hasClass("nav-hidden")) {
        hideNav();
    }


    checkLeftNav();

});

$.fn.scrollBottom = function () {
    return $(document).height() - this.scrollTop() - this.height();
};
