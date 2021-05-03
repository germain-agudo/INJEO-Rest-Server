const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearTaller,
        obtenerTaller,
        obtenerTalleres,
        actualizarTaller, 
        borrarTaller } = require('../controllers/talleres');
const { existeTallerPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerTalleres );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTallerPorId ),
    validarCampos,
], obtenerTaller );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('titulo','El Titulo es obligatorio').not().isEmpty(),
    check('subtitulo','El subTitulo es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),
    check('enlace','El enlace es obligatorio').not().isEmpty(),
    validarCampos
], crearTaller );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('titulo','El titulo es obligatorio').not().isEmpty(),
    check('id').custom( existeTallerPorId ),
    validarCampos
],actualizarTaller );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTallerPorId ),
    validarCampos,
],borrarTaller);



module.exports = router;