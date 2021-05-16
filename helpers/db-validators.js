const Role = require('../models/role');
const{ Usuario,Noticia, Taller, Convocatoria, Carrera, Escuela , Oferta, Inscripccion, Externo, Persona}= require('../models');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo, estado:true });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Usuario activo
 */
const existeUsuarioActivoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario.estado ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


const existePersonaPorId = async( id ) => {

    // Verificar si el correo existe
    const existePersona = await Persona.findById(id);
    if ( !existePersona ) {
        throw new Error(`El id no existe ${ id }`);
    }
}








/**
 * PERSONA
 */

 const curpExiste = async( curp = '' ) => {

    // Verificar si el correo existe
    const existeCurp = await Persona.findOne({ curp, estado:true });
    if ( existeCurp ) {
        throw new Error(`la CURP: '${ curp }', ya está registrada`);
    }
}
/**
 * 
 *  Externo RFC
 */
const rfcExiste = async( rfc = '' ) => {

    // Verificar si el correo existe
    const existeRfc = await Externo.findOne({ rfc, estado:true });
    if ( existeRfc ) {
        throw new Error(`El RFC: '${ rfc }', ya está registrado`);
    }
}









/**
 * RELACIÓN EXISTENTE
 */

const existeRelacion = async ( usuario_id= '', roles=[])=>{

/*     const existeUsuario = await Usuario.findById(usuario_id)
    
    if (existeUsuario.rol==='EXTERNO_ROLE') {
        throw new Error(` el usuario: '${usuario_id}' tiene que rol de: '${ existeUsuario.rol }'`);
        
    }  */
    const existeUsuario = await Usuario.findById(usuario_id)
    
    const relacion = roles.includes( existeUsuario.rol );
    if ( !relacion ) {
        // throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    
        throw new Error(` el usuario: '${usuario_id}', tiene el rol de: '${ existeUsuario.rol }', y se require: '${roles}'`);
    
    }
  
}


const existeRelacionConUsuario= async(usuario_id='')=>{

    // Verificar si el correo existe
  
    const [existeUsuarioEnPersona, existeUsuarioEnExterno]= await Promise.all([
        Persona.find({usuario_id:usuario_id, estado:true}),
         Externo.find({usuario_id:usuario_id, estado:true}),
    ]);

    // console.log( existeUsuarioEnPersona.length);
    if ( existeUsuarioEnPersona.length>0 ) {
        throw new Error(`El usuario_id: '${usuario_id}, ya está registrado en la seccion de: 'Personas'`);
    }
    
    // console.log(existeUsuarioEnExterno.length);
    if ( existeUsuarioEnExterno.length>0 ) {
        throw new Error(`El usuario_id: '${usuario_id}, ya está registrado en la seccion de: 'Externos'`);
    }
}












/**************************** */




/**
 * Noticias
 */
 const existeNoticiaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeNoticia = await Noticia.findById(id);
    if ( !existeNoticia ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Talleres
 */
 const existeTallerPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeTaller = await Taller.findById(id);
    if ( !existeTaller ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Talleres
 */
 const existeConvocatoriaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeConvocatoria = await Convocatoria.findById(id);
    if ( !existeConvocatoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Carreras
 */
 const existeCarreraPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeCarrera = await Carrera.findById(id);
    if ( !existeCarrera ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Escuelas
 */
 const existeEscuelaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeEscuela = await Escuela.findById(id);
    if ( !existeEscuela ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Oferta Educativa   
 */
 const existeOfertaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeOferta = await Oferta.findById(id);
    if ( !existeOferta ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Inscripciónes a los talleres
 */
 const existeInscripcionPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeInscripcion = await Inscripccion.findById(id);
    if ( !existeInscripcion ) {
        throw new Error(`El id  ${ id } no existe`);
    }
}

/**
 * Externos
 */
const existeExternoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeExterno = await Externo.findById(id);
    if ( !existeExterno ) {
        throw new Error(`El id no existe ${ id }`);
    }
}







/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}





/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}

 


/**
 * 
 */









module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeNoticiaPorId,
    existeTallerPorId,
    existeConvocatoriaPorId,
    existeCarreraPorId,
    coleccionesPermitidas,
    existeEscuelaPorId,
    existeOfertaPorId, 
    existeInscripcionPorId, 
    existeExternoPorId,

  curpExiste,  
  rfcExiste,


  existeRelacion,
  existePersonaPorId,

  existeUsuarioActivoPorId,
  existeRelacionConUsuario,
  

    
}

