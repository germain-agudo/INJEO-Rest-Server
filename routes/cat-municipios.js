
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
    existeCatMunicipioPorId,
    existeCatMunicipioActivoPorId,
    existeCatEstadoActivoPorId
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerCatMunicipios,
   obtenerCatMunicipio,
     crearCatMunicipio,
actualizarCatMunicipio,
    borrarCatMunicipio    
} = require('../controllers/cat-municipio');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',[
    validarJWT,
    validarCampos
],obtenerCatMunicipios);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatMunicipioPorId ),
        validarCampos,
], obtenerCatMunicipio);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
   esAdminRole,
   check('municipio','El nombre del municipio es obligatorio').not().isEmpty(),
   check('estado_id','El estado_id es obligatorio').not().isEmpty(),
   check('estado_id').custom( existeCatEstadoActivoPorId ),
    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearCatMunicipio);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    esAdminRole,


    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatMunicipioPorId ),
    check('id').custom( existeCatMunicipioActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('municipio','El nombre del Municipio es obligatorio').not().isEmpty(),

    validarCampos,
], actualizarCatMunicipio);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  esAdminRole,

//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCatMunicipioActivoPorId ),
    validarCampos,
], borrarCatMunicipio);





module.exports = router;

