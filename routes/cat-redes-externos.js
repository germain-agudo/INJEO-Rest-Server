 

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
  // Red
  
    existeRedSocialPorId,
    existeRedSocialActivaPorId,
  // Red - Empresa  
    existeRedExternoPorId, 
    existeRedExternoActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
//usuario
  existeUsuarioActivoPorId
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerRedesExternos,
    obtenerRedExterno,
      crearRedExterno,
 actualizarRedExterno,
   eliminarRedExterno,
    buscarRelacion,
    
  
  
} = require('../controllers/cat-red-externos');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerRedesExternos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom( existeRedExternoPorId ),
        validarCampos,
], obtenerRedExterno);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  
  
  check('red_id','No es un ID válido').isMongoId(),
  check('usuario_empresa_id','No es un ID válido').isMongoId(),

  check('url','la url es obligatoria').not().isEmpty(),



  check('red_id','El campo: red_id es obligatorio').not().isEmpty(),
  check('usuario_empresa_id','El campo: usuario_empresa_id es obligatorio').not().isEmpty(),

  check('red_id').custom(existeRedSocialPorId),
  check('red_id').custom(existeRedSocialActivaPorId),
  
        check('usuario_empresa_id').custom( existeUsuarioActivoPorId ),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearRedExterno);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom( existeRedExternoPorId ),
  check('id').custom( existeRedExternoActivoPorId  ),

  check('url','la url es obligatoria').not().isEmpty(),

    validarCampos,
], actualizarRedExterno);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom( existeRedExternoPorId ),
  check('id').custom( existeRedExternoActivoPorId ),

    validarCampos,
], eliminarRedExterno);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'redes',
      'empresas',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;


