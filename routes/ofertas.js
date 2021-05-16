const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearOferta,
    actualizarOferta, 
        obtenerOfertas,
        borrarOferta,
        obtenerOferta,
   } = require('../controllers/ofertas');
const { existeEscuelaPorId, existeCarreraPorId , existeOfertaPorId} = require('../helpers');

// const { existeEscuelaPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerOfertas );

// Obtener una categoria por id - publico
router.get('/:id',[
    validarJWT,

    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeOfertaPorId ),
    validarCampos,
], obtenerOferta ); 

// Crear categoria - privado - cualquier persona con un token válido

router.post('/', [ 
    validarJWT,
 
    check('carrera_id', 'No es un id de Mongo válido').isMongoId(),
    check('escuela_id', 'No es un id de Mongo válido').isMongoId(),
    check('escuela_id').custom( existeEscuelaPorId ),
    check('carrera_id').custom( existeCarreraPorId ), 
    validarCampos
], crearOferta );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    // check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('id', 'No es un id de Mongo válido').isMongoId(),     
    check('id').custom( existeOfertaPorId),


    check('escuela_id', 'El campo escuela_id es obligatorio').not().isEmpty(),     
    check('carrera_id', 'El campo carrera_id es obligatorio').not().isEmpty(),     
 
    check('escuela_id', 'No es un id de Mongo válido').isMongoId(),     
    check('carrera_id', 'No es un id de Mongo válido').isMongoId(),     

    check('escuela_id').custom( existeEscuelaPorId ),
    check('carrera_id').custom( existeCarreraPorId ), 
        
    validarCampos
],actualizarOferta ); 

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeOfertaPorId ),
    validarCampos,
],borrarOferta); 


module.exports = router;