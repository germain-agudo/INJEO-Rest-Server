const{ Router } = require('express');
const { check } = require('express-validator');

const { validarCampos , validarArchivoSubir} = require('../middlewares/index');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

//Este lo solicits el server de models
const router = Router();


//crear algo nuevo
router.post('/' ,validarArchivoSubir, cargarArchivo);

// Actualizar una imagen
router.put('/:coleccion/:id',[ //los checks no se ejecutan hasta que se manda  a referenciar validar campos
    validarArchivoSubir,
    check('id','El id debe de ser de mongo ').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas( c, ['usuarios','noticias'] ) ),
    validarCampos,
],actualizarImagenCloudinary);
// ],actualizarImagen);






router.get('/:coleccion/:id',[
    check('id','El id debe de ser de mongo ').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas( c, ['usuarios','noticias'] ) ),
    validarCampos,
],mostrarImagen);


module.exports = router;