
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const {
   validarCampos,
   validarJWT,
   tieneRole,
   datosCompletos,
   esAdminRole,
}= require('../middlewares/index')

/**
 *  Los Validadores
 */

const  {
    existeCatGiroPorId,
    existeCatGiroActivoPorId,
}= require('../helpers/db-validators');

/** 
 *  Controladores 
 */

const {
   obtenerCatgiros,
   obtenerCatgiro,
     crearCatgiro,
actualizarCatgiro,
  eliminarCatgiro    
} = require('../controllers/cat-giro');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
    validarJWT,
    validarCampos
],obtenerCatgiros);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatGiroPorId ),

    validarCampos,
], obtenerCatgiro);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    esAdminRole,
    datosCompletos,
   check('giro','El giro es obligatorio').not().isEmpty(),
    validarCampos,

], crearCatgiro);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
   validarJWT,
   esAdminRole,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    
    check('id').custom( existeCatGiroPorId ),
    check('id').custom( existeCatGiroActivoPorId ),

    check('giro','El giro es obligatorio').not().isEmpty(),
    validarCampos,

], actualizarCatgiro);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,
//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatGiroPorId ),
    check('id').custom( existeCatGiroActivoPorId ),

    validarCampos,

], eliminarCatgiro);





module.exports = router;

