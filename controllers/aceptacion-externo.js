const {
    response
} = require('express');
const {
    Externo,
    Usuario
} = require('../models');

const aceptarUsuarioExterno = async (req, res = response) => {
    const fecha_aceptacion = Date.now();
    const { id } = req.params;
    const empresaDb = await Externo.findById(id);


    if (!empresaDb || !empresaDb.estado) {
        return res.status(401).json({
            msg: `EL id ${id} No existe - No puede hacer esto`
        });
    }


    const [externo, usuario] = await Promise.all([
        Externo.findByIdAndUpdate(id, {
            aceptacion: true,
            fecha_aceptacion
        }, {
            new: true
        }),
        Usuario.findByIdAndUpdate(empresaDb.usuario_id, {
            
            datos_completos: true
        }, {
            new: true
        })
    ])



res.json({
    externo,
    usuario
})

}


module.exports = {
    aceptarUsuarioExterno
}