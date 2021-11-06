
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
    existeCatCategoriaBolsaPorId,
    existeCatCategoriaBolsaActivoPorId,
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerCatCategoriaBolsas,
   obtenerCatCategoriaBolsa,
     crearCatCategoriaBolsa,
actualizarCatCategoriaBolsa,
    borrarCatCategoriaBolsa    
} = require('../controllers/cat-categoria-bolsa');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
  validarJWT,
  validarCampos
],obtenerCatCategoriaBolsas);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatCategoriaBolsaPorId ),
        validarCampos,
], obtenerCatCategoriaBolsa);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
   esAdminRole,
   check('categoria','La categoria de la oferta laboral es obligatorio').not().isEmpty(),

    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearCatCategoriaBolsa);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    esAdminRole,


    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatCategoriaBolsaPorId ),
    check('id').custom( existeCatCategoriaBolsaActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('categoria','La categoria de la oferta laboral es obligatorio').not().isEmpty(),

    validarCampos,
], actualizarCatCategoriaBolsa);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,

//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatCategoriaBolsaPorId ),
    check('id').custom( existeCatCategoriaBolsaActivoPorId ),
    validarCampos,
], borrarCatCategoriaBolsa);





module.exports = router;

