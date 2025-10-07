$(document).ready(function(){
    /* cargando paginas */
    const basePath = getBasePath();
    const homePath = getHomePath();
    const imgPath = getImgPath();
    
    $("#libreria-icons-svg").load(`${basePath}Views/Shared/libreria-icons.html`).hide();
    $("#headerPageTop").load(`${basePath}Views/Shared/_headerPageTop.html`, function() {
        $(".AvatarUser").load(`${basePath}Views/Shared/_avatarUser.html`, function() {
            fixImagePaths();
        });
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`, function() {
            setupHomeLinks();
            fixImagePaths();
        });
    });
    $("#menuSidebarLeft").load(`${basePath}Views/Shared/_menuSidebarLeft.html`, function() {
        $(".logo-ct").load(`${basePath}Views/Shared/_logo.html`, function(){
            setupHomeLinks();
            fixImagePaths();
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
    var pathParts = path.split('/').filter(Boolean); // Elimina elementos vacíos
    var pageName = 'home';

    if (pathParts.length > 0) {
        var lastPart = pathParts[pathParts.length - 1];
        if (lastPart.includes('.')) {
            pageName = lastPart.split('.')[0];
            pathParts.pop();
        }
        if (pathParts.length > 0) {
            var folderName = pathParts[pathParts.length - 1];
            pageName = folderName + '-' + pageName;
        }
    }
    $('body').addClass("page-" + pageName.toLowerCase());

    /* Menu Burger Check Right */
    $('#btn-cerrar-user').click(function(e) {
        $('#usuario-page').prop('checked', false);
    });
})

function getBasePath() {
    const currentPath = window.location.pathname;
    const hostname = window.location.hostname;
    
    // Para GitHub Pages
    if (hostname.includes('github.io')) {
        const pathParts = currentPath.split('/').filter(part => part);
        
        // Si estamos en la raíz del repo o index.html
        if (pathParts.length <= 1 || (pathParts.length === 2 && pathParts[1] === 'index.html')) {
            return `/${pathParts[0]}/`;
        }
        
        // Calcular cuántos niveles necesitamos subir
        const depth = pathParts.length - (pathParts[pathParts.length - 1].includes('.html') ? 2 : 1);
        const prefix = '../'.repeat(depth);
        
        return prefix;
    }
    
    // Para localhost
    // Si estamos en la raíz
    if (currentPath === '/' || currentPath === '/index.html') {
        return '';
    }
    
    // Contar cuántas carpetas hay desde la raíz hasta el archivo actual
    const pathParts = currentPath.split('/').filter(part => part && part !== 'index.html');
    
    // Si solo hay un archivo .html sin carpetas
    if (pathParts.length === 1 && pathParts[0].endsWith('.html')) {
        return '';
    }
    
    // Calcular cuántos "../" necesitamos
    // Restamos 1 porque el último elemento es el archivo
    const depth = pathParts[pathParts.length - 1].endsWith('.html') 
        ? pathParts.length - 1 
        : pathParts.length;
    
    return '../'.repeat(depth);
}

function getHomePath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    if (hostname.includes('github.io')) {
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length > 0) {
            const repoName = pathParts[0];
            return `/${repoName}/`;
        }
    }
    
    // Para localhost
    return '/';
}

function getImgPath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    if (hostname.includes('github.io')) {
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length > 0) {
            const repoName = pathParts[0];
            return `/${repoName}/Content/img/`;
        }
    }
    
    // Para localhost
    const basePath = getBasePath();
    return `${basePath}Content/img/`;
}

function fixImagePaths() {
    const imgPath = getImgPath();
    
    setTimeout(function() {
        $('img').each(function() {
            const currentSrc = $(this).attr('src');
            
            if (currentSrc && (currentSrc.includes('../../Content/img/') || currentSrc.includes('../Content/img/') || currentSrc.includes('Content/img/'))) {
                const fileName = currentSrc.split('/').pop();
                const newSrc = imgPath + fileName;
                $(this).attr('src', newSrc);
            }
        });
        
        $('source').each(function() {
            const currentSrcset = $(this).attr('srcset');
            
            if (currentSrcset && (currentSrcset.includes('../../Content/img/') || currentSrcset.includes('../Content/img/') || currentSrcset.includes('Content/img/'))) {
                const fileName = currentSrcset.split('/').pop();
                const newSrcset = imgPath + fileName;
                $(this).attr('srcset', newSrcset);
            }
        });
    }, 50);
}

function setupHomeLinks() {
    const homePath = getHomePath();
    
    setTimeout(function() {
        $('.dynamic-link-home').each(function() {
            $(this).attr('href', homePath);
        });
        
        $('a[href="/"], a[href="index.html"]').not('.dynamic-link').each(function() {
            $(this).attr('href', homePath);
        });
    }, 50);
}

function setupDynamicLinks() {
    const basePath = getBasePath();
    
    $('.dynamic-link').each(function() {
        const originalHref = $(this).attr('href');
        let newHref = originalHref;
        
        if (!originalHref || originalHref === '#' || originalHref === '') {
            return;
        }
        
        if (originalHref === 'index.html' || originalHref === '/') {
            newHref = getHomePath();
        } 
        else if (originalHref.endsWith('.html')) {
            // Detectar si el href ya incluye una ruta de carpeta
            if (originalHref.includes('/')) {
                // Si ya tiene una ruta como "Reservas/index.html"
                newHref = `${basePath}Views/${originalHref}`;
            } else {
                // Si es solo un archivo como "Tablas.html"
                newHref = `${basePath}Views/Pages/${originalHref}`;
            }
        }
        
        $(this).attr('href', newHref);
    });
}