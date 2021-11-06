
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
    existeCatEstadoPorId,
    existeCatEstadoActivoPorId 
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerCatEstados,
   obtenerCatEstado,
     crearCatEstado,
actualizarCatEstado,
  borrarCatEstado    
} = require('../controllers/cat-estado');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
  validarJWT,
  validarCampos
],obtenerCatEstados);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatEstadoPorId ),
        validarCampos,
], obtenerCatEstado);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
   esAdminRole,
   check('estado','El nombre del estado es obligatorio').not().isEmpty(),

    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearCatEstado);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    esAdminRole,


    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatEstadoPorId ),
    check('id').custom( existeCatEstadoActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('estado','El nombre del estado es obligatorio').not().isEmpty(),

    validarCampos,
], actualizarCatEstado);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,

//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatEstadoPorId ),
    check('id').custom( existeCatEstadoActivoPorId ),
    validarCampos,
], borrarCatEstado);





module.exports = router;

