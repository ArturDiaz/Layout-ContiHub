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
    var pathParts = path.split('/').filter(Boolean);
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
    $('body').attr("id", "page-" + pageName.toLowerCase());

    /* Generar breadcrumbs dinámicamente */
    generateBreadcrumbs();

    /* Menu Burger Check Right */
    $('#btn-cerrar-user').click(function(e) {
        $('#usuario-page').prop('checked', false);
    });
})

function getBasePath() {
    const currentPath = window.location.pathname;
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
        const pathParts = currentPath.split('/').filter(part => part);
        
        if (pathParts.length <= 1 || (pathParts.length === 2 && pathParts[1] === 'index.html')) {
            return `/${pathParts[0]}/`;
        }
        
        const depth = pathParts.length - (pathParts[pathParts.length - 1].includes('.html') ? 2 : 1);
        const prefix = '../'.repeat(depth);
        
        return prefix;
    }
    
    if (currentPath === '/' || currentPath === '/index.html') {
        return '';
    }
    
    const pathParts = currentPath.split('/').filter(part => part && part !== 'index.html');
    
    if (pathParts.length === 1 && pathParts[0].endsWith('.html')) {
        return '';
    }
    
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
    
    const basePath = getBasePath();
    return `${basePath}Content/img/`;
}

function fixImagePaths() {
    const imgPath = getImgPath();
    
    setTimeout(function() {
        $('img').each(function() {
            const currentSrc = $(this).attr('src');
            
            if (currentSrc && (currentSrc.includes('Content/img/'))) {
                // Extrae la parte después de "Content/img/"
                const relativePath = currentSrc.split('Content/img/')[1];
                const newSrc = imgPath + relativePath;
                $(this).attr('src', newSrc);
            }
        });
        
        $('source').each(function() {
            const currentSrcset = $(this).attr('srcset');
            
            if (currentSrcset && (currentSrcset.includes('Content/img/'))) {
                const relativePath = currentSrcset.split('Content/img/')[1];
                const newSrcset = imgPath + relativePath;
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
    const homePath = getHomePath();
    
    $('.dynamic-link').each(function() {
        const originalHref = $(this).attr('href');
        let newHref = originalHref;
        
        if (!originalHref || originalHref === '#' || originalHref === '') {
            return;
        }
        
        // Si es index.html o "/", va al home (raíz del proyecto)
        if (originalHref === 'index.html' || originalHref === '/') {
            newHref = homePath;
        } 
        // Si es cualquier otra página .html
        else if (originalHref.endsWith('.html')) {
            if (originalHref.includes('/')) {
                // Si ya tiene una ruta como "Reservas/index.html"
                newHref = `${basePath}Views/${originalHref}`;
            } else {
                // Si es solo un archivo como "Tablas.html" (pero NO index.html)
                newHref = `${basePath}Views/Pages/${originalHref}`;
            }
        }
        
        // Actualizar el href
        $(this).attr('href', newHref);
    });
}

function generateBreadcrumbs() {
    // Buscar el contenedor de breadcrumbs
    const breadcrumbContainer = $('#breadcrumbs');
    
    // Si no existe el contenedor, no hacer nada
    if (breadcrumbContainer.length === 0) {
        return;
    }
    
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const homePath = getHomePath();
    
    let pathParts = pathname.split('/').filter(part => part);
    
    // Si estamos en GitHub Pages, eliminar el nombre del repo
    if (hostname.includes('github.io') && pathParts.length > 0) {
        pathParts.shift(); // Eliminar el nombre del repo
    }
    
    // Filtrar carpetas que no queremos mostrar
    const excludeFolders = ['Views', 'Pages', 'Shared', 'Content'];
    pathParts = pathParts.filter(part => !excludeFolders.includes(part));
    
    // Limpiar el contenedor
    breadcrumbContainer.empty();
    
    // Agregar el enlace de inicio
    const homeLink = $('<a>').attr('href', homePath).addClass("flex-r ai-c").html(`
        <svg class="bs-icon"><use xlink:href="#i-home"></use></svg>
        
    `);
    breadcrumbContainer.append($('<li>').append(homeLink));
    
    // página de inicio, terminar aquí
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'index.html')) {
        breadcrumbContainer.find('li').last().addClass('active');
        return;
    }
    
    // Construir 
    for (let i = 0; i < pathParts.length; i++) {
        let part = pathParts[i];
        
        if (i === pathParts.length - 1 && part.endsWith('.html')) {
            const fileName = part.replace('.html', '');
            const displayName = formatBreadcrumbName(fileName);
            
            if (fileName === 'index' && i > 0) {
                continue;
            }
            
            const currentItem = $('<span>').text(displayName);
            breadcrumbContainer.append($('<li>').addClass('active').append(currentItem));
        } 
        else if (!part.endsWith('.html')) {
            const displayName = formatBreadcrumbName(part);
            
            const folderItem = $('<span>').text(displayName);
            breadcrumbContainer.append($('<li>').append(folderItem));
        }
    }
}

function formatBreadcrumbName(name) {
    const customNames = {
        'index': 'Inicio',
        'Reservas': 'Mis Reservas',
        'Tablas': 'Gestión de Tablas',
        'Pages': 'Páginas'
    };
    
    if (customNames[name]) {
        return customNames[name];
    }

    name = name.replace(/[-_]/g, ' ');
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}