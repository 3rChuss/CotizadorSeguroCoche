//cotizador constructor
function Seguro(marca, modelo, anio, tipoSeguro) {
     this.marca = marca;
     this.modelo = modelo;
     this.anio = anio;
     this.tipoSeguro = tipoSeguro;
}

//cotizar
Seguro.prototype.cotizarSeguro = (seguro) => {
     /*
     * marcas entre la 1 y la 25 - base * 3.50
     * entre la 25 y la 50 - base * 2
     * entre la 50 y la última - base * 1.15
     */
     let cantidad;
     const base = 400;
     
     if (seguro.marca >= 1 && seguro.marca <= 25) cantidad = base * 3.50;
     else if (seguro.marca > 26 && seguro.marca <= 50) cantidad = base * 2;
     else if (seguro.marca >= 51 && seguro.marca <= selectMarca.options.length) cantidad = base * 1.15;
     
     //Leer el año del auto
     const diferencia = new Date().getFullYear() - seguro.anio;
     //Cada anio hay que reducir un 3%
     cantidad -= ((diferencia * 3 ) * cantidad ) / 100 ;

     /*
     * Tipo de seguro
     * basico el precio establecido
     * completo por 30%
     */

     if(seguro.tipoSeguro === 'completo'){
          cantidad *=1.30;
     }

     return cantidad;
}

//lo que se muestra en la interfaz
function Interfaz() {}
     //mensaje que se imprime en html
     Interfaz.prototype.mostrarError = (mensaje, tipo) => {
          const div = document.createElement('div');
          if(tipo == 'error'){
               div.classList.add('mensaje', 'error');
          }else{
               div.classList.add('mensaje', 'correcto');
          }

          div.innerHTML = `${mensaje}`;
          formulario.insertBefore(div, document.querySelector('.form-row'));
          setTimeout(() => {
               document.querySelector('.mensaje').remove();
          }, 5000);
     }

     //imprimer el resultado
     Interfaz.prototype.mostrarResultado = (seguro, cantidad) => {
          const resultado = document.getElementById('resultado');
          let marca, modelo;
          
          //recogemos la marca del select box
          marca = selectMarca.options[seguro.marca].innerText;          
          modelo = seguro.modelo.innerText

          //creamos un div
          const div = document.createElement('div');
          //rellenarmos el resultado div
          div.innerHTML = `
                    <p class="header">Resumen:</p>
                    <p>Marca: ${marca}</p>
                    <p>Modelo: ${modelo}</p>
                    <p>Año: ${seguro.anio}</p>
                    <p>Tipo Seguro: ${seguro.tipoSeguro}</p>
                    <p><strong>Total: </strong> <span style="color:red;">${cantidad}</span></p>
                         `;

          const spinner = document.querySelector('#cargando img');
          spinner.style.display = 'block';
          setTimeout(() => {
               spinner.style.display = 'none';
               resultado.appendChild(div);
          }, 1500);
          
     }

//event listener
const formulario = document.getElementById('cotizar-seguro');
formulario.addEventListener('submit', (e) => {
     e.preventDefault();
     //leer el valor de la marca
     const marcaSeleccionada = selectMarca.options[selectMarca.selectedIndex].value;
     
     //leer el modelo
     const modeloSeccionado = selectModelos.options[selectModelos.selectedIndex];
     
     //leer el valor del año
     const anioSelected = selectAnios.options[selectAnios.selectedIndex].value;
     
     //leer radio buttons
     const tipoSeguro = document.querySelector('input[name="tipo"]:checked').value;
     
     //instanciamos una interfaz
     const interfaz =  new Interfaz();
     //revisamos los campos que no esten vacíos
     if (marcaSeleccionada === '' || modeloSeccionado === '' ||anioSelected === '' || tipoSeguro === ''){
          //imprime un error
          interfaz.mostrarError('Faltan datos, alguno de los campos está vacío', 'error');
     }else{
          //eliminar resultados previos
          const resultados = document.querySelector('#resultado div');
          if(resultados != null){
               resultados.remove();
          }

          //Instanciar seguro
          const nuevoSeguro = new Seguro(marcaSeleccionada, modeloSeccionado, anioSelected, tipoSeguro);
          //cotizar seguro
          const precioSeguro = nuevoSeguro.cotizarSeguro(nuevoSeguro);

          //mostrar el resultado
          interfaz.mostrarResultado(nuevoSeguro, precioSeguro);
     }
     
     
});

const max = new Date().getFullYear(),
      min = max - 20;

//Rellenamos los select
     //marcas
     const selectMarca = document.getElementById('marca');
     const requestMarcas = new XMLHttpRequest();
     requestMarcas.open('GET', '../datos/marcas.json');
     requestMarcas.responseType = 'json';
     requestMarcas.send();
     
     requestMarcas.onload = function () {
          const marcasCoches = requestMarcas.response;
          cargarMarcas(marcasCoches);
     };
     function cargarMarcas(listadoMarcas) {
          const marcas = listadoMarcas.marcas;
          for (let i = 0; i < marcas.length; i++) {
               const marca = marcas[i];
               let option = document.createElement('option');
               option.value = marca.id;
               option.innerHTML = marca.Nombre;
               selectMarca.appendChild(option);
          }
     };

     //modelos
     const selectModelos = document.getElementById('modelo');
     const requestModelo = new XMLHttpRequest;
     requestModelo.open('GET', '../datos/modelos.json');
     requestModelo.responseType = 'json';
     requestModelo.send();

     selectMarca.addEventListener('change', function(){
          const seleccionar = selectModelos.options[0];
          [...selectModelos.options].forEach(option => {
               option.remove();
          })
          selectModelos.appendChild(seleccionar);
          const modeloCoches = requestModelo.response;
          cargarModelos(modeloCoches);
     });

     function cargarModelos(modelosCoches) {
          const modelos = modelosCoches.modelos;
          let marcaSeleccionada = selectMarca.value;
          modelos.forEach((modelo, i) => {
               if(marcaSeleccionada === modelo.id_marca){
                    const option = document.createElement('option');
                    option.value = modelo.id;
                    option.innerHTML = modelo.Nombre;
                    selectModelos.appendChild(option);
               }               
          });  
     };

     //años
     const selectAnios = document.getElementById('anio');
     for(let i = max; i > min; i--){
          //creamos el option del select y rellenamos
          let option = document.createElement('option');
          option.value = i;
          option.innerHTML = i;
          selectAnios.appendChild(option);
     }

