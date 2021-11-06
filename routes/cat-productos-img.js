
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
  // PRODUCTO
   existeProductoPorId,
   existeProductoActivoPorId,
  // IMGS
  existeImagePorId,
  existeImageActivaPorId,
  // PRODUCTO-IMG  
 existeProductoImgPorId, 
 existeProductoImgActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerProductosImagenes,
   obtenerProductoImagen,
     crearProductoImg,
actualizarProductoImg,
  eliminarProductoImg,
  buscarRelacion
  
  
} = require('../controllers/cat-prodcutos-img');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerProductosImagenes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom( existeProductoImgPorId ),
        validarCampos,
], obtenerProductoImagen);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('producto_id','No es un ID válido').isMongoId(),
  check('imagen_id','No es un ID válido').isMongoId(),

  check('producto_id','El campo: producto_id es obligatorio').not().isEmpty(),
  check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),

//   check('producto_id').custom(existeProductoPorId),
  check('producto_id').custom(existeProductoActivoPorId),
  
        check('imagen_id').custom(existeImagePorId),
        check('imagen_id').custom(existeImageActivaPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearProductoImg);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeProductoImgPorId),
  check('id').custom(existeProductoImgActivoPorId),

    // check('producto_id','No es un ID válido').isMongoId(),
    check('imagen_id','No es un ID válido').isMongoId(),
  
    // check('producto_id','El campo: producto_id es obligatorio').not().isEmpty(),
    check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),
  
    // check('producto_id').custom(existeProductoPorId),
    // check('producto_id').custom(existeProductoActivoPorId),
          check('imagen_id').custom(existeImagePorId),
          check('imagen_id').custom(existeImageActivaPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarProductoImg);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeProductoImgPorId),
  check('id').custom(existeProductoImgActivoPorId),

    validarCampos,
], eliminarProductoImg);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'productos',
      'imagenes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

