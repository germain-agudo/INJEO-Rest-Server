const { response } = require('express');
const {  Externo } = require('../models');

/* 
const obtenerNoticias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, noticias ] = await Promise.all([
        Noticia.countDocuments(query),
        Noticia.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        noticias
    });
}

const obtenerNoticia = async(req, res = response ) => {

    const { id } = req.params;
    const noticia = await Noticia.findById( id )
                            .populate('usuario', 'nombre');

    res.json( noticia );

} */

const crearExterno = async(req, res = response ) => {
 // console.log(req.body );
 const fecha_registro = Date.now();
 
 const {  nombre,numero_telefonico, 
    rfc, direccion, correo, password, img,
    rol
     

} = req.body;
    

    const externoDB= await Externo.findOne({rfc, estado:true});

    if (externoDB) {
        return res.status(400).json({
            msg: `¡Lo sentimos! el RFC '${ externoDB.rfc }', ya existe`
        });
    }

const externo = new Externo({ 
    nombre,numero_telefonico, 
    rfc, direccion, correo, password, img,
    rol, fecha_registro
   });

// // Encriptar la contraseña
/* const salt = bcryptjs.genSaltSync();
usuario.password = bcryptjs.hashSync( password, salt ); */

// // Guardar en BD
await externo.save();
    
res.json({
    externo
   
});

}

/* const actualizarNoticia = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

    const noticia = await Noticia.findByIdAndUpdate(id, data, { new: true });

    res.json( noticia);

}

const borrarNoticia = async(req, res =response ) => {

    const { id } = req.params;
    const noticiaBorrada = await Noticia.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( noticiaBorrada );
}
 */



module.exports = {
    crearExterno,
    // obtenerNoticias,
    // obtenerNoticia,
    // actualizarNoticia,
    // borrarNoticia,
}