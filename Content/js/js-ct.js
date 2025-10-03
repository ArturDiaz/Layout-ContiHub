$(document).ready(function(){
    /* cargando paginas */
    $("#libreria-icons-svg").load("Views/Topic/libreria-icons.html").hide();

    /* SideBar */
    $("#expanded-sidebar").on('change', function(){
        $("body").toggleClass("sidebar-checked", $(this).is(':checked'));
    });
    $(".btn-collapse-js button").on("click", function() {
        $('#expanded-sidebar').prop('checked', true);
        $("body").addClass("sidebar-checked");
    });

    /* Nombre de pagina en class */
    var path = window.location.pathname;
    var pageName = path.split('/').pop().split('.')[0];
    $('body').addClass("page-"+pageName.toLowerCase());

    /* Menu Burger Check Right */
    $('#btn-cerrar-user').click(function(e) {
        $('#usuario-page').prop('checked', false);
    });

})