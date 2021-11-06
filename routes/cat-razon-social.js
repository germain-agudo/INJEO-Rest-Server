
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
  existeCatRazonSocialPorId, 
  existeCatRazonSocialActivaPorId,
  existeUsuarioActivoPorId,
  razonSocialExiste,
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerCatRazonesSociales,
   obtenerCatRazonSocial,
     crearCatRazonSocial,
actualizarCatRazonSocial,
  eliminarCatRazonSocial   
} = require('../controllers/cat-razon-social');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/', [
    validarJWT,
    datosCompletos,
    validarCampos
],obtenerCatRazonesSociales);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    validarJWT,  
    datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatRazonSocialPorId ),
        validarCampos,
], obtenerCatRazonSocial   );


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,
   check('razon_social','La razón Social es obligatoria').not().isEmpty(),
   check('razon_social').custom( razonSocialExiste ),

   check('usuario_empresa_id','El usuario_empresa_id es obligatoria').not().isEmpty(),
   check('usuario_empresa_id').custom( existeUsuarioActivoPorId ),   
    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearCatRazonSocial);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatRazonSocialPorId ),
    check('id').custom(  existeCatRazonSocialActivaPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('razon_social','La Razón Social es obligatoria').not().isEmpty(),

    validarCampos,
], actualizarCatRazonSocial);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatRazonSocialPorId),
    check('id').custom( existeCatRazonSocialActivaPorId ),
    validarCampos,
], eliminarCatRazonSocial);





module.exports = router;

