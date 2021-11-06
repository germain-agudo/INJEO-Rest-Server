
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const { 
    validarCampos, 
    tieneRole, 
    esAdminRole, 
    validarJWT, 
    datosCompletos
  }= require('../middlewares/index')

/**
 *  Los Validadores
 */

const  {
  existePracticaProfesionalPorId, 
  existePracticaProfesionalActivoPorId
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const { obtenerPracticasProfesionales, obtenerPracticaProfesional, crearPracticaProfesional, actualizarPracticaProfesional, eliminarPracticaProfesional } = require('../controllers/practicas-profesionales');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerPracticasProfesionales);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existePracticaProfesionalPorId ),
        validarCampos,
], obtenerPracticaProfesional );


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    //  esAdminRole,
   datosCompletos,
   check('nombre_programa','El nombre o titulo del programa es obligatorio').not().isEmpty(),
   check('dependencia','El la dependencia o el lugar es obligatorio').not().isEmpty(),
   check('perfil','El perfil del prestador o practicante es obligatorio').not().isEmpty(),
   check('descripcion','La descripción es obligatoria').not().isEmpty(),   
   check('nombre_responsable','nombre_responsable').not().isEmpty(),   
   check('correo_responsable','El correo del responsable es obligatorio').not().isEmpty(),  
   check('correo_responsable','El correo del responsable es obligatorio').isEmail(),   
   check('telefono_responsable','El número telefonico del responsable es obligatorio').not().isEmpty(),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearPracticaProfesional);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existePracticaProfesionalPorId ),
    check('id').custom( existePracticaProfesionalActivoPorId ),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    check('nombre_programa','El nombre o titulo del programa es obligatorio').not().isEmpty(),
    check('dependencia','El la dependencia o el lugar es obligatorio').not().isEmpty(),
    check('perfil','El perfil del prestador o practicante es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),   
    check('nombre_responsable','nombre_responsable').not().isEmpty(),   
    check('correo_responsable','El correo del responsable es obligatorio').not().isEmpty(),  
    check('correo_responsable','El correo del responsable es obligatorio').isEmail(),   
    check('telefono_responsable','El número telefonico del responsable es obligatorio').not().isEmpty(),
 
    validarCampos,

], actualizarPracticaProfesional );

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existePracticaProfesionalPorId ),
    check('id').custom( existePracticaProfesionalActivoPorId ),
    validarCampos,
], eliminarPracticaProfesional ) ;





module.exports = router;








