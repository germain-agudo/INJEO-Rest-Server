
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
    existeCatCategoriaProductoPorId,
    existeCatCategoriaProductoActivoPorId,
}= require('../helpers/db-validators');

/** 
 *  Controladores 
 */

const {
   obtenerCatCategoriaProductos,
   obtenerCatCategoriaProducto,
     crearCatCategoriaProducto,
actualizarCatCategoriaProducto,
  eliminarCatCategoriaProducto    
} = require('../controllers/cat-tipo-producto');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
    validarJWT,
    datosCompletos,
    validarCampos,

],obtenerCatCategoriaProductos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    validarJWT,
    datosCompletos,

    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatCategoriaProductoPorId ),

    validarCampos,
], obtenerCatCategoriaProducto);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    esAdminRole,
    datosCompletos,
   check('categoria','La categoria de producto es obligatorio').not().isEmpty(),
    validarCampos,

], crearCatCategoriaProducto);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
   validarJWT,
   esAdminRole,
//    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    
    check('id').custom( existeCatCategoriaProductoPorId ),
    check('id').custom( existeCatCategoriaProductoActivoPorId ),

    check('categoria','La Categoria de producto es obligatorio').not().isEmpty(),
    validarCampos,

], actualizarCatCategoriaProducto);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,
//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatCategoriaProductoActivoPorId ),
    check('id').custom( existeCatCategoriaProductoPorId  ),

    validarCampos,

], eliminarCatCategoriaProducto);





module.exports = router;

