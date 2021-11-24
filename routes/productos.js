
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

const  {
    existeProductoPorId,
    existeProductoActivoPorId,
    existeCatCategoriaProductoActivoPorId,
    existeUsuarioActivoPorId,
    existeExternoActivoPorId,
    existeCatCategoriaProductoPorId
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerProductos,
   obtenerProducto,
     crearProducto,
actualizarProducto,
  eliminarProducto    
} = require('../controllers/productos');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerProductos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
        validarCampos,
], obtenerProducto);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,
  //  check('empresa_id','El empresa_id es obligatorio').not().isEmpty(),
  //  check('empresa_id').custom( existeExternoActivoPorId ),
   check('categoria_id','El categproaproducto_id es obligatorio').not().isEmpty(),
   check('categoria_id').custom( existeCatCategoriaProductoPorId ),
   check('categoria_id').custom( existeCatCategoriaProductoActivoPorId ),
   check('nombre','El nombre es obligatorio').not().isEmpty(),
   check('precio_original','El precio es obligatorio').not().isEmpty(),
   check('descuento','El descuento es obligatorio').not().isEmpty(),
   check('fecha_inicio','La fecha_inicio es obligatorio').not().isEmpty(),
   check('fecha_fin','La fecha_fin es obligatorio').not().isEmpty(),


 
    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearProducto);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('id').custom( existeProductoActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('categoria_id','El categproaproducto_id es obligatorio').not().isEmpty(),
    check('categoria_id').custom( existeCatCategoriaProductoActivoPorId ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('precio_original','El precio es obligatorio').not().isEmpty(),
    check('descuento','El descuento es obligatorio').not().isEmpty(),
    check('fecha_inicio','La fecha_inicio es obligatorio').not().isEmpty(),
    check('fecha_fin','La fecha_fin es obligatorio').not().isEmpty(),
 
    validarCampos,
], actualizarProducto);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('id').custom( existeProductoActivoPorId ),
    validarCampos,
], eliminarProducto);





module.exports = router;

