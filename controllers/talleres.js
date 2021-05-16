const { response } = require('express');
const { Taller } = require('../models');


const obtenerTalleres = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, talleres ] = await Promise.all([
        Taller.countDocuments(query),
        Taller.find(query)
            .populate('usuario', 'user_name')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        talleres
    });
}

const obtenerTaller = async(req, res = response ) => {

    const { id } = req.params;
    const taller = await Taller.findById( id )
                            .populate('usuario', 'user_name');

    res.json( taller );

}

const crearTaller = async(req, res = response ) => {

   const { titulo,subtitulo, descripcion, enlace}=req.body;
    // titulo = titulo.toUpperCase();

    // const tituloDB = await Noticia.findOne({ titulo });

/*     if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    } */

    // Generar la data a guardar
    const data = {
        "titulo":titulo.toUpperCase(),
        subtitulo,
        descripcion,
        enlace,
        usuario: req.usuario._id
    }
   

    
    const taller = new Taller( data );
    // Guardar DB
    await taller.save();

    res.status(201).json(taller);

}

const actualizarTaller = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

    const taller = await Taller.findByIdAndUpdate(id, data, { new: true });

    res.json( taller);

}

const borrarTaller = async(req, res =response ) => {

    const { id } = req.params;
    const tallerBorrado = await Taller.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( tallerBorrado );
}




module.exports = {
    crearTaller,
    obtenerTaller,
    obtenerTalleres,
    actualizarTaller,
    borrarTaller,
}