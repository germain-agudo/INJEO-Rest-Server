
const { Router } = require('express');
const { check } = require('express-validator');


const {
 

    validarCampos,
    
    validarJWT,
     

    manipulacionPersonaExterno,

    esAdminRole,
    tieneRole,

} = require('../middlewares');
const {
     esRoleValido, 
     emailExiste, 
     existeUsuarioPorId, 
     curpExiste, 
     existeRelacion, 
     existePersonaPorId,
     existeUsuarioActivoPorId,
existeRelacionConUsuario,
     } = require('../helpers/db-validators');

const { 
        personaPost,
        personaPut,
        personaDelete,
        personasGet,
        obtenerPersona,
       

  
    } = require('../controllers/personas');

const router = Router();







router.get('/', personasGet );

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existePersonaPorId ),   
    validarCampos
],obtenerPersona );







router.put('/:id',[
    validarJWT,
    // esAdminRole,

    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existePersonaPorId ),
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('apellido_materno', 'El apellido materno es obligatorio').not().isEmpty(),
    check('edad', 'la edad es obligatoria').not().isEmpty(),
    check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    check('curp', 'La CURP  es obligatoria').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('municipio', 'El municipio es obligatorio').not().isEmpty(),
    check('region', 'La region es obligatoria').not().isEmpty(),   

// manipulacionPersonaExterno,



    // check('correo').custom( emailExiste ),
   
    
    // check('rol').custom( esRoleValido ),


    validarCampos
],personaPut );



router.post('/',[
    validarJWT,
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('apellido_materno', 'El apellido materno es obligatorio').not().isEmpty(),
    check('edad', 'la edad es obligatoria').not().isEmpty(),
    check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    check('curp', 'La CURP  es obligatoria').not().isEmpty(),
    check('curp').custom(curpExiste),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('municipio', 'El municipio es obligatorio').not().isEmpty(),
    check('region', 'La region es obligatoria').not().isEmpty(),   
    check('usuario_id', 'El id_usuario es obligatoria').not().isEmpty(),
    
    check('usuario_id', 'No es un ID válido').isMongoId(),
    check('usuario_id').custom( existeUsuarioPorId ),       
    check('usuario_id').custom( existeUsuarioActivoPorId ),    
    check('usuario_id').custom( existeRelacionConUsuario ),    

    check('usuario_id').custom(relacion=>existeRelacion ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
   
    validarCampos
], personaPost );



router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    // tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom( existePersonaPorId ),

    validarCampos
],personaDelete );







module.exports = router;