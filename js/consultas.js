console.log('Mascotas');
const listaMascotas = document.getElementById('lista_mascotas');
const tipo = document.getElementById('tipo');
const nombre = document.getElementById('nombre');
const dueno = document.getElementById('dueno');
const form = document.getElementById('form');
const indice = document.getElementById('indice');
const btnguardar = document.getElementById('btnguardar');
const btnCerrar = document.getElementById('btnCerrar');
const strurl = "http://localhost:5000/consultas";
let mascotas=[
];


async function listarmascotas(){
  try{
      const respuesta = await fetch(strurl);
      const mascotasDelServer = await respuesta.json();
      if(Array.isArray(mascotasDelServer)){
        mascotas = mascotasDelServer;
      }
      if (mascotas.length > 0 ){
        const htmlmascotas = mascotas.map((mascota,index)=>`<tr>
        <th scope="row">${index}</th>
        <td>${mascota.tipo}</td>
        <td>${mascota.nombre}</td>
        <td>${mascota.dueno}</td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-info editar" data-indice=${index} onclick="editar(${index})" data-toggle="modal" data-target="#exampleModalCenter"><i class="far fa-edit"></i></button>
            <button type="button" class="btn btn-danger eliminar"><i class="far fa-trash-alt"></i></button>
          </div>                  
        </td>
        </tr>`).join("");
        listaMascotas.innerHTML = htmlmascotas;
        Array.from(document.getElementsByClassName("editar")).forEach((botonEditar, index)=>botonEditar.onclick = editar(index));
        Array.from(document.getElementsByClassName("eliminar")).forEach((botonEliminar, index)=>botonEliminar.onclick = eliminar(index));
      }
      else{
        const htmlmascotas = `<tr>
        <td colspan="5">No hay mascotas para mostrar</td>
        </tr>`;
        listaMascotas.innerHTML = htmlmascotas;
      }
  }
  catch (error){
    $(".alert").show();
  }
};


function editar(elemento){
  //console.log("editar",elemento);
  //console.dir(elemento);
  //console.log("editar",elemento.dataset.indice);
  //console.log("editar",elemento);
  return function cuandoHagoClick(){
    //console.log(elemento);
    //console.log(mascotas[elemento].tipo);
    //$('#exampleModalCenter').modal('toggle');
    btnguardar.innerHTML = 'Editar';    
    const mascota = mascotas[elemento];
    tipo.value=mascota.tipo;
    nombre.value=mascota.nombre;
    dueno.value=mascota.dueno;
    indice.value = elemento;    
  }
};


async function enviarDatos(e){
  e.preventDefault();
  try {
    const datos={
      tipo: tipo.value,
      nombre: nombre.value,
      dueno: dueno.value
    };
    //console.log('evento', e);
    let url = null;
    let method = null;
    const accion=btnguardar.innerHTML;
    if (accion=='Editar'){
      method = 'PUT'
      url = `${strurl}/${indice.value}`;
      mascotas[indice.value] = datos;
    }
    else{
      method = 'POST';
      url = strurl;    
      //mascotas.push(datos);
    }
    //console.log('datos', datos);  
    const respuesta = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    })
    if (respuesta.ok){
      listarmascotas();
      resetModal();
    }
  }
  catch(error){
    //throw error;
    $(".alert").show();
  }
};


function resetModal(){
  tipo.value="";
  nombre.value="";
  dueno.value="";
  indice.value = "";
  btnguardar.innerHTML = 'Guardar';
};


function eliminar(index){
  return async function clickEnEliminar(){
    try {
      console.log("index eliminado ",index);
      let url = `${strurl}/${index}`;
      const respuesta = await fetch(url, {
          method: 'DELETE',
      });
      if (respuesta.ok){
          listarmascotas();
          resetModal();
      }        
    }
    catch(error){
      //throw error;
      $(".alert").show();
    }
  }
};

listarmascotas();

form.onsubmit = enviarDatos;
btnguardar.onclick = enviarDatos;
//btnCerrar.onclick= resetModal;

function solicitarMascotas (){
  fetch(strurl).then((respuesta)=>{
    if(respuesta.ok){
      return respuesta.json();
    }
  }).then(mascotasDelServer=>{
    console.log({mascotasDelServer});
    mascotas = mascotasDelServer;
  });
}