
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
    existeCatTipoNegocioPorId,
    existeCatTipoNegocioActivoPorId,
}= require('../helpers/db-validators');

/** 
 *  Controladores 
 */

const {
   obtenerCatTipoNegocios,
   obtenerCatTipoNegocio,
     crearCatTipoNegocio,
actualizarCatTipoNegocio,
  eliminarCatTipoNegocio    
} = require('../controllers/cat-tipo-negocio');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
    validarJWT,
    validarCampos
],obtenerCatTipoNegocios);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatTipoNegocioPorId ),

    validarCampos,
], obtenerCatTipoNegocio);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    esAdminRole,
    datosCompletos,
   check('tipo','El tipo de empresa es obligatorio').not().isEmpty(),
    validarCampos,

], crearCatTipoNegocio);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
   validarJWT,
   esAdminRole,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    
    check('id').custom( existeCatTipoNegocioPorId ),
    check('id').custom( existeCatTipoNegocioActivoPorId ),

    check('tipo','El tipo de empresa es obligatorio').not().isEmpty(),
    validarCampos,

], actualizarCatTipoNegocio);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,
//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatTipoNegocioPorId ),
    check('id').custom( existeCatTipoNegocioActivoPorId ),

    validarCampos,

], eliminarCatTipoNegocio);





module.exports = router;

