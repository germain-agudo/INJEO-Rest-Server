const { response } = require('express');
const { Carrera } = require('../models');


const obtenerCarreras = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, carreras ] = await Promise.all([
        Carrera.countDocuments(query),
        Carrera.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        carreras
    });
}

const obtenerCarrera = async(req, res = response ) => {

    const { id } = req.params;
    const carrera = await Carrera.findById( id )
                            .populate('usuario', 'nombre');

    res.json( carrera );

}

const crearCarrera = async(req, res = response ) => {

   const  nombre =req.body.nombre.toUpperCase();   

 const carreraDB = await Carrera.findOne({ nombre });

    if ( carreraDB ) {
        return res.status(400).json({
            msg: `La carrera ${ carreraDB.nombre }, ya existe`
        });
    }
    

    // Generar la data a guardar
    const data = {
       nombre,       
        usuario: req.usuario._id
    }   
    
    console.log(data);
    const carrera = new Carrera( data );
    // Guardar DB
    await carrera.save();
    res.status(201).json(carrera);
}

const actualizarCarrera = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
   
    const carrera = await Carrera.findByIdAndUpdate(id, data, { new: true });

    res.json( carrera);

}

const borrarCarrera = async(req, res =response ) => {

    const { id } = req.params;
    const carreraBorrada = await Carrera.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( carreraBorrada );
}




module.exports = {
    crearCarrera,
    obtenerCarreras,
    obtenerCarrera,
    actualizarCarrera,
    borrarCarrera,
}