// Variables
const productos = document.querySelectorAll('.producto');
const vaciarCarritoBtn = document.querySelector('.table__vaciar__button');
let carritoArray = [];


// Eventos
addEventListeners();
function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        carritoArray = JSON.parse(localStorage.getItem('productos')) || [];
        crerCarritoHTML();
        contadorDinamicoCarrito();
    });

    // Obteniendo los datos del producto seleccionado
    productos.forEach( (producto) => {
        producto.addEventListener('click', obtenerProducto);   
    });

    // Btn vaciar carrito
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        carritoArray = [];
        sincronizarStorage();
        limpiarCarrito();
        contadorDinamicoCarrito();
    });
}


// Funciones
function obtenerProducto(e) {
    e.preventDefault();
    const producto = e.target.parentElement.parentElement;
    const productoObj = {
        avif: producto.querySelector('.avif').srcset,
        webp: producto.querySelector('.webp').srcset,
        src: producto.querySelector('img').src.replace('http://127.0.0.1:5501/15-carrito-compras-RC/', ''),
        titulo: producto.querySelector('.producto__heading').textContent,
        texto: producto.querySelector('.producto__texto').textContent,
        precio: producto.querySelector('.producto__precio').textContent,
        cantidad: 1,
        id: producto.getAttribute('data-id')
    }
    seccionProductoIndividual(productoObj);
}
function seccionProductoIndividual(productoObj) {
    const { avif, webp, src, titulo, texto, precio } = productoObj;
    
    // Actualizando input de cantidad dinamicamente con el valor que tenga en el carritoArray
    let cantidad, inputValue;
    const existe = carritoArray.some( (producto) => producto.id === productoObj.id );
    if(existe) {
        inputValue = 'Actualizar Carrito';
        carritoArray.forEach( (producto) => {
            if(producto.id === productoObj.id) {
                cantidad = producto.cantidad;
            }
        });
    }
    else {
        cantidad = 1;
        inputValue = 'Agregar al carrito';
    }
    

    // Enlace para ' <= regresar'
    const productos = document.querySelector('.productos');
    const enlaceRegresar = document.createElement('a');
    enlaceRegresar.innerHTML = `&#8678; Volver al inicio`;
    enlaceRegresar.href = '#';
    enlaceRegresar.classList.add('regresar');
    enlaceRegresar.onclick = () => {
        agregarQuitarClase(productos);
    }


    // Contenedores principales
    const seccionProductos = document.createElement('section');
    seccionProductos.classList.add('pagina-producto');
    const grid = document.createElement('div');
    grid.classList.add('pagina-producto__grid');
    const productoContenido = document.createElement('div');
    productoContenido.classList.add('producto__contenido');


    // Imagen
    const picture = document.createElement('picture');
    const sourceAvif = document.createElement('source');
    sourceAvif.srcset = avif;
    sourceAvif.type = 'image/avif';
    const sourceWebp = document.createElement('source');
    sourceWebp.srcset = webp;
    sourceWebp.type = 'image/webp';
    const imagen = document.createElement('img');
    imagen.src = src;
    imagen.classList.add('producto__imagen');
    imagen.loading = 'lazy';
    imagen.width = '500';
    imagen.height = '300';
    imagen.alt = 'imagen producto';
    picture.appendChild(sourceAvif);
    picture.appendChild(sourceWebp);
    picture.appendChild(imagen);


    // Datos de Producto 
    const heading = document.createElement('h3');
    heading.classList.add('producto__heading');
    heading.textContent = titulo;
    const parrafoTexto = document.createElement('p');
    parrafoTexto.classList.add('producto__texto');
    parrafoTexto.textContent = texto;
    const parrafoPrecio = document.createElement('p')
    parrafoPrecio.classList.add('producto__precio');
    parrafoPrecio.textContent = precio;


    // Contenedor de Cantidad
    const contenedorCantidad = document.createElement('div');
    contenedorCantidad.classList.add('producto-contenido__cantidad');
    const label = document.createElement('label');
    label.classList.add('producto__label');
    label.setAttribute('for', 'cantidad');
    if(titulo.includes('Limón') || titulo.includes('Manzana') ) {
        label.textContent = 'Cantidad en kg:';
    }
    else {
        label.textContent = 'Cantidad:';
    }
    const inputCantidad = document.createElement('input');
    inputCantidad.classList.add('producto__cantidad');
    inputCantidad.type = 'number';
    inputCantidad.name = 'cantidad';
    inputCantidad.id = 'cantidad';
    inputCantidad.min = '1';
    inputCantidad.max = '99';
    inputCantidad.value = cantidad;
    contenedorCantidad.appendChild(label);
    contenedorCantidad.appendChild(inputCantidad);
    
    
    // Boton - Agregar al carrito
    const inputButton = document.createElement('input');
    inputButton.classList.add('producto__button');
    inputButton.type = 'button';
    inputButton.value = inputValue;
    inputButton.onclick = () => {
        llenarArrayCarrito(productoObj);
    }
  

    // Agregando el contenido a productoContenido
    productoContenido.appendChild(heading);
    productoContenido.appendChild(parrafoTexto);
    productoContenido.appendChild(parrafoPrecio);
    productoContenido.appendChild(contenedorCantidad);
    productoContenido.appendChild(inputButton);


    // Agregando a los Contenedores Principales
    grid.append(picture);
    grid.append(productoContenido);
    seccionProductos.appendChild(grid);


    // Agregando al HTML
    agregarQuitarClase(productos);
    const seccionProductoIndividual = document.querySelector('.producto-individual');
    seccionProductoIndividual.appendChild(enlaceRegresar);
    seccionProductoIndividual.appendChild(seccionProductos);
}
function llenarArrayCarrito(productoObj) {

    // Sincronizando cantidad colocada en el input
    const existe = carritoArray.some( (producto) => producto.id === productoObj.id );
    if(existe) {

        // Si ya tiene productos
        carritoArray.map( (producto) => {
            if(producto.id === productoObj.id) {

                const cantidad = parseInt(document.querySelector('#cantidad').value);

                // Validando
                if(cantidad <= 0) {
                    alert('La cantidad tiene que ser mayor a cero');
                    return;
                }
                else if(!isNaN(cantidad) === false) {
                    alert('Tiene que ingresar la cantidad');
                    return;
                }

                // Llenado objeto con la cantidad
                producto.cantidad = cantidad;
                return producto;
            }
        });
    }
    else { // Si es el primer producto

        const cantidad = parseInt(document.querySelector('#cantidad').value);

        // Validando
        if(cantidad <= 0) {
            alert('La cantidad tiene que ser mayor a cero');
            return;
        }
        else if(!isNaN(cantidad) === false) {
            alert('Tiene que ingresar una cantidad valida.');
            return;
        }

        // Llenado objeto con la cantidad
        productoObj.cantidad = cantidad;
        carritoArray = [ ...carritoArray, productoObj ];
    }

    // Una vez listos los datos de array..
    crerCarritoHTML();
    sincronizarStorage();
    contadorDinamicoCarrito();
}
function crerCarritoHTML() {
      limpiarCarrito();
      carritoArray.forEach( producto => {
          const { avif, webp, src, titulo, precio, cantidad, id } = producto;
          
          const trRow = document.createElement('tr');
          trRow.classList.add('table__tr');
          trRow.setAttribute('data-id', id);
          
          // Imagen
          const tdImg = document.createElement('td');
          tdImg.classList.add('table__td');
          const picture = document.createElement('picture');
          const sourceAvif = document.createElement('source');
          sourceAvif.srcset = avif;
          sourceAvif.type = 'image/avif';
          const sourceWebp = document.createElement('source');
          sourceWebp.srcset = webp;
          sourceWebp.type = 'image/webp';
          const imagen = document.createElement('img');
          imagen.src = src;
          imagen.classList.add('producto__imagen');
          imagen.loading = 'lazy';
          imagen.width = '500';
          imagen.height = '300';
          imagen.alt = 'imagen producto';
          picture.appendChild(sourceAvif);
          picture.appendChild(sourceWebp);
          picture.appendChild(imagen);
          tdImg.appendChild(picture);
  
          // Nombre/titulo
          const tdNombre = document.createElement('td');
          tdNombre.classList.add('table__td');
          tdNombre.textContent = titulo;
  
          // Precio
          const tdPrecio = document.createElement('td');
          tdPrecio.classList.add('table__td');
          const precioFomateado = formatearPrecio(precio);
          tdPrecio.textContent = `$${(precioFomateado * parseInt(cantidad)).toFixed(2)}`;
  
          // Cantidad
          const tdCantidad = document.createElement('td');
          tdCantidad.classList.add('table__td');
          tdCantidad.textContent = cantidad;
  
          // Boton de eliminar
          const tdBtnEliminar = document.createElement('td');
          tdBtnEliminar.classList.add('table__td');
          const inputEliminar = document.createElement('input');
          inputEliminar.type = 'button';
          inputEliminar.value = 'x';
          inputEliminar.classList.add('table__eliminar');
          inputEliminar.onclick = () => {
              eliminarProducto(id);
          }
          tdBtnEliminar.appendChild(inputEliminar);
  
          // Agregando al Row
          trRow.appendChild(tdImg);
          trRow.appendChild(tdNombre);
          trRow.appendChild(tdPrecio);
          trRow.appendChild(tdCantidad);
          trRow.appendChild(tdBtnEliminar);
  
          // Agregando al HTML
          const tbody = document.querySelector('.table__body');
          tbody.appendChild(trRow);
      });
}
function eliminarProducto(id) {
    carritoArray = carritoArray.filter((productoArray) => productoArray.id !== id);
    crerCarritoHTML();
    sincronizarStorage();
    contadorDinamicoCarrito();
}



// Helpers
function limpiarProductoIndividual() {
    const productoIndividual = document.querySelector('.producto-individual');
    while( productoIndividual.firstChild ) {
        productoIndividual.removeChild(productoIndividual.firstChild);
    }
}
function agregarQuitarClase(elemento) {
    if(elemento.classList.contains('display-none')) { // se le quita
        limpiarProductoIndividual();
        elemento.classList.remove('display-none');
    }
    else { // se le agrega
        elemento.classList.add('display-none');
    }
}
function limpiarCarrito() {
    const tbody = document.querySelector('.table__body');
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}
function formatearPrecio(precio) {
    precio = precio.replace('$', '');
    precio = precio.replace(',', '');
    const precioFormateado = parseFloat(precio);
    return precioFormateado;
}
function sincronizarStorage() {
    localStorage.setItem('productos', JSON.stringify(carritoArray));
}
function contadorDinamicoCarrito() {
    const totalCantidades = document.querySelector('.total-cantidades');
    const resultado = carritoArray.reduce( (acumulador, producto) => acumulador + producto.cantidad, 0 );
    totalCantidades.textContent = resultado;
}
