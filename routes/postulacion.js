const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJWT, 
    validarCampos,
     esAdminRole, 
     datosCompletos, 
     tieneRole
    
    } = require('../middlewares');

const {  
    obtenerPostulaciones,
    obtenerPostulacion,
    crearPostulacion,
    actualizarPostulacion,
    eliminarPostulacion,
    buscarRelacion
      
   } = require('../controllers/postulaciones');
const { 
    existePostulacionPorId,
    existePostulacionActivoPorId,
    existeExternoActivoPorId,
    existeBolsaActivaPorId,
    coleccionesPermitidas,
    } = require('../helpers');


const router = Router();


//  Obtener todas la postulaciones - privado
router.get('/',[
    validarJWT, 
    tieneRole('ADMIN_ROLE','USER_ROLE'), 
    datosCompletos, 
    validarCampos],
    obtenerPostulaciones
 );

// Obtener una categoria por id - publico
router.get('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePostulacionPorId ),
    validarCampos,
], obtenerPostulacion ); 

// Crear categoria - privado - cualquier persona con un token válido

router.post('/', [ 
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    
    check('curriculum_url', 'El curriculum_url es obligatorio').not().isEmpty(),     
    check('bolsa_id', 'El campo bolsa_id es obligatorio').not().isEmpty(),     
    check('bolsa_id').custom( existeBolsaActivaPorId),     
 

    validarCampos
], crearPostulacion);

// Actualizar - privado - cualquiera con token válido

router.put('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePostulacionPorId ),
    check('id').custom( existePostulacionActivoPorId ),
    check('curriculum_url', 'El curriculum_url es obligatorio').not().isEmpty(),     

    validarCampos,
], actualizarPostulacion ); 


// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePostulacionPorId ), 
    check('id').custom( existePostulacionActivoPorId ), 

    // check('id').custom( existeOfertaPorId ),
    validarCampos,
], eliminarPostulacion); 



router.get('/:coleccion/:id',[
    // validarJWT,
    // check('id','El id debe de ser de mongo ').isMongoId(),
  
    // check('id').custom( existeOfertaPorId ),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas( c, [    
        'bolsas',
        'postulados',    
        'postulacion-usuario',    
  ] ) ),
     validarCampos,
  ], buscarRelacion); 



module.exports = router;