const { response } = require('express');
const { Convocatoria } = require('../models');


const obtenerConvocatorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, convocatorias ] = await Promise.all([
        Convocatoria.countDocuments(query),
        Convocatoria.find(query)
            .populate('usuario', 'user_name')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        convocatorias
    });
}

const obtenerConvocatoria = async(req, res = response ) => {

    const { id } = req.params;
    const convocatoria = await Convocatoria.findById( id )
                            .populate('usuario', 'user_name');

    res.json( convocatoria );

}

const crearConvocatoria = async(req, res = response ) => {

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
   

    
    const convocatoria = new Convocatoria( data );
    // Guardar DB
    await convocatoria.save();

    res.status(201).json(convocatoria);

}

const actualizarConvocatoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

    const convocatoria = await Convocatoria.findByIdAndUpdate(id, data, { new: true });

    res.json( convocatoria);

}

const borrarConvocatoria = async(req, res =response ) => {

    const { id } = req.params;
    const convocatoriaBorrada = await Convocatoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( convocatoriaBorrada );
}




module.exports = {
    crearConvocatoria,
    obtenerConvocatorias,
    obtenerConvocatoria,
    actualizarConvocatoria,
    borrarConvocatoria,
}