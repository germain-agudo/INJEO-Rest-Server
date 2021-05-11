const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {   crearInscripcion,
        actualizarInscripcion, 
        obtenerInscripciones,
        borrarInscripcion,
        obtenerInscripcion,
      
   } = require('../controllers/inscripciones');
const { existeUsuarioPorId, existeInscripcionPorId, existeTallerPorId} = require('../helpers');

// const { existeEscuelaPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerInscripciones );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeInscripcionPorId ),
    validarCampos,
], obtenerInscripcion ); 

// Crear categoria - privado - cualquier persona con un token válido

router.post('/', [ 
    validarJWT,
    check('participante_id', 'El campo participante_id es obligatorio').not().isEmpty(),     
    check('taller_id', 'El campo taller_id es obligatorio').not().isEmpty(),   
 
    check('participante_id', 'No es un id de Mongo válido').isMongoId(),
    check('taller_id', 'No es un id de Mongo válido').isMongoId(),

    check('participante_id').custom( existeUsuarioPorId ),
    check('taller_id').custom( existeTallerPorId ), 

    validarCampos
], crearInscripcion);

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    // check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('id', 'No es un id de Mongo válido').isMongoId(),   
    check('id').custom( existeInscripcionPorId ), 

    // check('id').custom( existeOfertaPorId),


    check('participante_id', 'El campo participante_id es obligatorio').not().isEmpty(),     
    check('taller_id', 'El campo taller_id es obligatorio').not().isEmpty(),     
 
    check('participante_id', 'No es un id de Mongo válido').isMongoId(),     
    check('taller_id', 'No es un id de Mongo válido').isMongoId(),     

    check('participante_id').custom( existeUsuarioPorId ),
    check('taller_id').custom( existeTallerPorId ), 
        
    validarCampos
],actualizarInscripcion); 

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeInscripcionPorId ), 

    // check('id').custom( existeOfertaPorId ),
    validarCampos,
],borrarInscripcion); 


module.exports = router;