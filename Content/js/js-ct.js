$(document).ready(function(){
    /* cargando paginas */
    const basePath = getBasePath();
    const homePath = getHomePath();
    $("#libreria-icons-svg").load(`${basePath}Views/Shared/libreria-icons.html`).hide();
    $("#headerPageTop").load(`${basePath}Views/Shared/_headerPageTop.html`, function() {
        $(".AvatarUser").load(`${basePath}Views/Shared/_avatarUser.html`);
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`);
    });
    $("#menuSidebarLeft").load(`${basePath}Views/Shared/_menuSidebarLeft.html`, function() {
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`, function(){
            setupHomeLinks();
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

function getHomePath() {
    // Detectar si estamos en GitHub Pages
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    if (hostname.includes('github.io')) {
        // Extraer el nombre del repositorio
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length > 0) {
            const repoName = pathParts[0];
            return `/${repoName}/`;
        }
    }
    
    // Para localhost o dominio personalizado
    const basePath = getBasePath();
    if (basePath === '') {
        return '/';
    }
    return `${basePath}index.html`;
}

function setupHomeLinks() {
    const homePath = getHomePath();
    
    // Usar un timeout muy corto para asegurar que el DOM esté listo
    setTimeout(function() {
        // Actualizar todos los enlaces que apuntan al home
        $('.dynamic-link-home').each(function() {
            $(this).attr('href', homePath);
        });
        
        // También actualizar cualquier enlace con href="/"
        $('a[href="/"], a[href="index.html"]').not('.dynamic-link').each(function() {
            $(this).attr('href', homePath);
        });
        
        console.log('Home links configurados a:', homePath);
    }, 50);
}

function setupDynamicLinks() {
    const basePath = getBasePath();
    
    // Recorrer todos los enlaces con clase dynamic-link
    $('.dynamic-link').each(function() {
        const originalHref = $(this).attr('href');
        let newHref = originalHref;
        
        // Si es vacío o "#", ignorar
        if (!originalHref || originalHref === '#' || originalHref === '') {
            return;
        }
        
        // Si es index.html, va al home
        if (originalHref === 'index.html' || originalHref === '/') {
            newHref = getHomePath();
        } 
        // Si es cualquier otra página, va a Views/Pages/
        else if (originalHref.endsWith('.html')) {
            newHref = `${basePath}Views/Pages/${originalHref}`;
        }
        
        // Actualizar el href
        $(this).attr('href', newHref);
    });
    
    console.log('Dynamic links configurados con basePath:', basePath);
}