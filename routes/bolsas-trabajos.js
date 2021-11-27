 
const { Router } = require('express');
const { check  } = require('express-validator');

/**
 *  Los Middlewares
 */
const { 
      validarCampos, 
      tieneRole,
      esAdminRole,
      validarJWT,
      datosCompletos,  
}= require('../middlewares/index')

/**
 *  Los Validadores
 */ 
const  {
        existeBolsaPorId,
        existeBolsaActivaPorId,
        existeCatCategoriaBolsaActivoPorId,
        existeCatEstadoActivoPorId,
        existeCatMunicipioActivoPorId,
        existeUsuarioPorId,
        existeUsuarioActivoPorId,
        comprobarDatosCompletos,
}= require('../helpers/db-validators');

/**
 *  Controladores
 */
const {
        obtenerBolsas,
        obtenerBolsa,
        crearBolsa,
        actualizarBolsa,
        eliminarBolsa    
} = require('../controllers/bolsa-trabajos');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerBolsas);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        validarCampos,
], obtenerBolsa);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('titulo','El título es obligatorio').not().isEmpty(),
        check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
        check('enlace','El enlace es obligatorio').not().isEmpty(),

      
      
        check('usuario_empresa_id','El usuario_empresa_id es obligatoria').not().isEmpty(),
        check('usuario_empresa_id').custom( existeUsuarioPorId), 
        check('usuario_empresa_id').custom( existeUsuarioActivoPorId ), 
        check('usuario_empresa_id').custom( comprobarDatosCompletos ), 

        check('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        check('salario','El salario es obligatorio').not().isEmpty(),       
        check('beneficios','Los beneficios son obligatorio').not().isEmpty(),       
        check('modalidad','La modalidad es obligatorio').not().isEmpty(),       
        check('horario','El horario es obligatorio').not().isEmpty(),       
        check('categoriabolsa_id','La categoria de la bolsa es obligatorio').not().isEmpty(),       
        check('categoriabolsa_id').custom( existeCatCategoriaBolsaActivoPorId ),       
        check('estado_id','El estado es obligatorio').not().isEmpty(),       
        check('estado_id').custom( existeCatEstadoActivoPorId ),       
        check('municipio_id','El municipio es obligatorio').not().isEmpty(),       
        check('municipio_id').custom( existeCatMunicipioActivoPorId ),       


        validarCampos,
], crearBolsa);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[    
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        check('id').custom(existeBolsaActivaPorId),
        check('titulo','El título es obligatorio').not().isEmpty(),
        check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
        check('enlace','El enlace es obligatorio').not().isEmpty(),


        check('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),       
        check('salario','El salario es obligatorio').not().isEmpty(),       
        check('beneficios','Los beneficios son obligatorio').not().isEmpty(),       
        check('modalidad','La modalidad es obligatorio').not().isEmpty(),       
        check('horario','El horario es obligatorio').not().isEmpty(),       
        check('categoriabolsa_id','La categoria de la bolsa es obligatorio').not().isEmpty(),       
        check('categoriabolsa_id').custom( existeCatCategoriaBolsaActivoPorId ),       
        check('estado_id','El estado es obligatorio').not().isEmpty(),       
        check('estado_id').custom( existeCatEstadoActivoPorId ),       
        check('municipio_id','El municipio es obligatorio').not().isEmpty(),       
        check('municipio_id').custom( existeCatMunicipioActivoPorId ),  
        validarCampos,
], actualizarBolsa);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        check('id').custom(existeBolsaActivaPorId),
        validarCampos,
], eliminarBolsa);




module.exports = router;

