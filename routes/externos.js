
const { Router } = require('express');
const { check } = require('express-validator');


const {
    validarCampos,
    // validarJWT,
    // esAdminRole,
    // tieneRole
} = require('../middlewares');


const { 
    crearExterno
    } = require('../controllers/externos');
const {emailExiste } = require('../helpers/index');

const router = Router();





/* 

router.get('/', usuariosGet );

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),   
    validarCampos
],obtenerUsuario );


 */


/* 
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos
],usuariosPut );
 
 */



router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('rfc', 'El RFC  es obligatorio').not().isEmpty(),
     check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('numero_telefonico', 'El número telefonico es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('correo').custom( emailExiste ),


    validarCampos
], crearExterno);

/* router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );
 */
// router.patch('/', usuariosPatch );





module.exports = router;