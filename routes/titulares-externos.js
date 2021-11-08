
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
    existeTitularExternoPorId,
    existeTitularExternoActivoPorId,
    curpTitularExternoExiste
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerTitularExternos,
   obtenerTitularExterno,
     crearTitularExterno,
actualizarTitularExterno,
  eliminarTitularExterno    
} = require('../controllers/titular-externo');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerTitularExternos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeTitularExternoPorId ),
        validarCampos,
], obtenerTitularExterno);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  //  datosCompletos,
  //  esAdminRole,
   check('nombre','El nombre es obligatorio').not().isEmpty(),
   check('apellidos','El apellidos es obligatorio').not().isEmpty(),
   check('curp','La CURP es obligatorio').not().isEmpty(),
   check('curp','La CURP no es válida').isLength({ min: 10, max:10 }),
   check('curp').custom( curpTitularExternoExiste ),


   check('ine_url','El INE es obligatorio').not().isEmpty(),
   check('direccion','La dirección del domicilio es obligatoria').not().isEmpty(),
   check('correo_electronico','El correo_electronico es obligatorio').not().isEmpty(),
   check('correo_electronico','El correo_electronico no es válido').isEmail(),
   check('numero_telefonico','El numero_telefonico es obligatorio').not().isEmpty(),
  
    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearTitularExterno);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeTitularExternoPorId ),
    check('id').custom( existeTitularExternoActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellidos','El apellidos es obligatorio').not().isEmpty(),
    check('curp','La CURP es obligatorio').not().isEmpty(),
    check('curp','La CURP no es válida').isLength({ min: 10, max:10 }),
    check('ine_url','El INE es obligatorio').not().isEmpty(),
    check('direccion','La dirección del domicilio es obligatoria').not().isEmpty(),
    check('correo_electronico','El correo_electronico es obligatorio').not().isEmpty(),
   check('correo_electronico','El correo_electronico no es válido').isEmail(),
    
    check('numero_telefonico','El numero_telefonico es obligatorio').not().isEmpty(),
   

    validarCampos,
], actualizarTitularExterno);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeTitularExternoPorId ),
    check('id').custom( existeTitularExternoActivoPorId ),
    validarCampos,
], eliminarTitularExterno);





module.exports = router;

