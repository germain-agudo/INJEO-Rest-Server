const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJWT, 
    validarCampos,
     esAdminRole, 
     datosCompletos, 
     tieneRole
    
    } = require('../middlewares');

const {   crearInscripcion,
        actualizarInscripcion, 
        obtenerInscripciones,
        borrarInscripcion,
        obtenerInscripcion,
        buscarRelacion,
        cambiarEstatusInscrito
      
   } = require('../controllers/inscripciones');
const { 
        existeUsuarioPorId,
        existeInscripcionPorId,
        existeTallerPorId,
        coleccionesPermitidas,
        existeInscripcionActivaPorId
    } = require('../helpers');

// const { existeEscuelaPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/',[validarJWT, tieneRole('ADMIN_ROLE','USER_ROLE'), datosCompletos, validarCampos], obtenerInscripciones );

// Obtener una categoria por id - publico
router.get('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeInscripcionPorId ),
    validarCampos,
], obtenerInscripcion ); 

// Crear categoria - privado - cualquier persona con un token válido

router.post('/', [ 
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('participante_id', 'El campo participante_id es obligatorio').not().isEmpty(),     
    check('taller_id', 'El campo taller_id es obligatorio').not().isEmpty(),   
 
    check('participante_id', 'No es un id de Mongo válido').isMongoId(),
    check('taller_id', 'No es un id de Mongo válido').isMongoId(),

    check('participante_id').custom( existeUsuarioPorId ),
    check('taller_id').custom( existeTallerPorId ), 

    validarCampos
], crearInscripcion);

// Actualizar - privado - cualquiera con token válido
// router.put('/:id',[
//     validarJWT,

//     // esAdminRole,
//     tieneRole('ADMIN_ROLE','USER_ROLE'),
//     datosCompletos,
//     // check('nombre','El nombre es obligatorio').not().isEmpty(), 
//     check('id', 'No es un id de Mongo válido').isMongoId(),   
//     check('id').custom( existeInscripcionPorId ), 
//     // check('id').custom( existeOfertaPorId),
//     check('participante_id', 'El campo participante_id es obligatorio').not().isEmpty(),     
//     check('taller_id', 'El campo taller_id es obligatorio').not().isEmpty(),     
 
//     check('participante_id', 'No es un id de Mongo válido').isMongoId(),     
//     check('taller_id', 'No es un id de Mongo válido').isMongoId(),     

//     check('participante_id').custom( existeUsuarioPorId ),
//     check('taller_id').custom( existeTallerPorId ), 
        
//     validarCampos
// ],actualizarInscripcion); 




router.put('/:id',[
    validarJWT
    , esAdminRole
    , check('id', 'No es un id de Mongo válido').isMongoId()  
    , check('id').custom( existeInscripcionActivaPorId )
    , validarCampos
]
, cambiarEstatusInscrito
) 



// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    // tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeInscripcionActivaPorId ), 
    // check('id').custom( existeInscripcionPorId ), 

    // check('id').custom( existeOfertaPorId ),
    validarCampos,
],borrarInscripcion); 



router.get('/:coleccion/:id',[
    // validarJWT,
    // check('id','El id debe de ser de mongo ').isMongoId(),
  
    // check('id').custom( existeOfertaPorId ),

    check('coleccion').custom(c=> coleccionesPermitidas( c, [    
        'talleres',
        'usuarios',
        'incripcion-usuario'    
  ] ) ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id', 'id es obligatorio').not().isEmpty(),
     validarCampos,
  ], buscarRelacion); 



module.exports = router;