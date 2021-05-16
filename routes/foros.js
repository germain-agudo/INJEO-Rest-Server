
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const { validarCampos, validarJWT}= require('../middlewares/index')

/**
 *  Los Validadores
 */

const  {existeUsuarioPorId, }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
obtenerForo,
obtenerForos,
crearForo,
actualizarForo,
eliminarForo    
} = require('../controllers/foros');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerForos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
], obtenerForo);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
    check('tiutulo','El tìtulo es obligatorio').not().isEmpty(),
], crearForo);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('tiutulo','El tìtulo es obligatorio').not().isEmpty(),
], actualizarForo);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
    check('id','No es un ID válido').isMongoId(),
], eliminarForo);





module.exports = router;

