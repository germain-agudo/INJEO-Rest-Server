const { response } = require('express');
const { Escuela } = require('../models');


const obtenerEscuelas = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, escuelas ] = await Promise.all([
        Escuela.countDocuments(query),
        Escuela.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        escuelas    
    });
}

const obtenerEscuela = async(req, res = response ) => {

    const { id } = req.params;
    const escuela = await Escuela.findById( id )
                            .populate('usuario', 'nombre');

    res.json( escuela );

}

const crearEscuela = async(req, res = response ) => {

   const  nombre =req.body.nombre.toUpperCase();   

 const escuelaDB = await Escuela.findOne({ nombre });

    if ( escuelaDB ) {
        return res.status(400).json({
            msg: `La escuela ${ escuelaDB.nombre }, ya existe`
        });
    }
    

    // Generar la data a guardar
    const data = {
       nombre,       
        usuario: req.usuario._id
    }   
    
    console.log(data);
    const escuela = new Escuela( data );
    // Guardar DB
    await escuela.save();
    res.status(201).json(escuela);
}

const actualizarEscuela = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
   
    const escuela = await Escuela.findByIdAndUpdate(id, data, { new: true });

    res.json( escuela);

}

const borrarEscuela = async(req, res =response ) => {

    const { id } = req.params;
    const escuelaBorrada = await Escuela.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( escuelaBorrada );
}




module.exports = {
    crearEscuela,
    obtenerEscuelas,
    obtenerEscuela,
    actualizarEscuela,
    borrarEscuela,
}