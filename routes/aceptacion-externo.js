
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const { 
    validarCampos, 
    tieneRole, 
    esAdminRole, 
    validarJWT, 
    datosCompletos
  }= require('../middlewares/index')

/**
 *  Los Validadores
 */

// const  {

//  }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   aceptarUsuarioExterno,
} = require('../controllers/aceptacion-externo');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */


/**
 * Obtener Un Registro
 */


/**
 *  Crear Y Guardar Un Registro
 */


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    esAdminRole,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   //  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
], aceptarUsuarioExterno);

/**
 * Eliminar Un Registro
 */




module.exports = router;

