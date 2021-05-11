const Role = require('../models/role');
const{ Usuario,Noticia, Taller, Convocatoria, Carrera, Escuela , Oferta, Inscripccion}= require('../models');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
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
    
}

