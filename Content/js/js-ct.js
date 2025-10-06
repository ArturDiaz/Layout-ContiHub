$(document).ready(function(){
    /* cargando paginas */
    const basePath = getBasePath();
    $("#libreria-icons-svg").load(`${basePath}Views/Shared/libreria-icons.html`).hide();
    $("#headerPageTop").load(`${basePath}Views/Shared/_headerPageTop.html`, function() {
        $(".AvatarUser").load(`${basePath}Views/Shared/_avatarUser.html`);
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`);
    });
    $("#menuSidebarLeft").load(`${basePath}Views/Shared/_menuSidebarLeft.html`, function() {
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`, function(){
            getHomePath();
        });
        
        setupDynamicLinks();

        /* SideBar */
        $("#expanded-sidebar").on('change', function(){
            $("body").toggleClass("sidebar-checked", $(this).is(':checked'));
        });
        $(".btn-collapse-js button").on("click", function() {
            $('#expanded-sidebar').prop('checked', true);
            $("body").addClass("sidebar-checked");
        });
    });
    $("#footer").load(`${basePath}Views/Shared/_footer.html`);
    


    /* Nombre de pagina en class */
    var path = window.location.pathname;
    var pageName = path.split('/').pop().split('.')[0];
    $('body').addClass("page-"+pageName.toLowerCase());

    /* Menu Burger Check Right */
    $('#btn-cerrar-user').click(function(e) {
        $('#usuario-page').prop('checked', false);
    });

})

function getBasePath() {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/index.html') {
        return '';
    }
    
    // Si estamos en Views/Pages/
    if (currentPath.includes('/Views/Pages/')) {
        return '../../';
    }
    // Si estamos en Views/
    if (currentPath.includes('/Views/')) {
        return '../';
    }
    return '';
}

function setupDynamicLinks() {
    const basePath = getBasePath();
    
    // Recorrer todos los enlaces con clase dynamic-link
    $('.dynamic-link').each(function() {
        const originalHref = $(this).attr('href');
        let newHref = originalHref;
        
        // Si es index.html, va a la raíz
        if (originalHref === 'index.html') {
            newHref = `${basePath}index.html`;
        } 
        // Si es cualquier otra página, va a Views/Pages/
        else if (originalHref.endsWith('.html')) {
            newHref = `${basePath}Views/Pages/${originalHref}`;
        }
        
        // Actualizar el href
        $(this).attr('href', newHref);
    });
}
function getHomePath() {
    const basePath = getBasePath();
    return basePath === '' ? '/' : `${basePath}index.html`;
}