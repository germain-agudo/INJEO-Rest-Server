const { response } = require('express');
const { Carrera } = require('../models');


const obtenerCarreras = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, carreras ] = await Promise.all([
        Carrera.countDocuments(query),
        Carrera.find(query)
            .populate('usuario', 'user_name')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

// console.log(carreras[4].fecha_registro.toLocaleDateString());

    res.json({
        total,
        carreras,
  
    });
}

const obtenerCarrera = async(req, res = response ) => {

    const { id } = req.params;
    const carrera = await Carrera.findById( id )
                            .populate('usuario', 'user_name');

    res.json( carrera );

}

const crearCarrera = async(req, res = response ) => {

   const  nombre =req.body.nombre.toUpperCase();   

 const carreraDB = await Carrera.findOne({ nombre });

//  const fecha_registro = new Date().toLocaleDateString();
 const fecha_registro = Date.now();
//  const fecha_registro = new Date().toUTCString();;
//  const fecha_registro = new Date().toDateString() 
 

    if ( carreraDB ) {
        if (!carreraDB.estado) {
            await Carrera.findByIdAndUpdate( carreraDB._id, { estado : true, usuario: req.usuario._id, fecha_registro}, { new: true })
            return res.status(200).json({
                nombre,
                usuario:req.usuario._id,
                fecha_registro
            })
        } else{
            return res.status(400).json({
                msg: `La carrera ${ carreraDB.nombre }, ya existe`
            });
        }
       
    }
    

    // Generar la data a guardar
    const data = {
       nombre,       
        usuario: req.usuario._id,
        fecha_registro 
      
    }   
    
    // console.log(data);
    const carrera = new Carrera( data );
    // Guardar DB
    await carrera.save();
    res.status(201).json(carrera);
}






const actualizarCarrera = async( req, res = response ) => {

    const fecha_registro = Date.now();

    




    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre  = data.nombre.toUpperCase();
    data.fecha_registro = fecha_registro;


    const carreraDB = await Carrera.findOne( {nombre:data.nombre} );

    if ( carreraDB ) {
        if (!carreraDB.estado) {
            await Carrera.findByIdAndUpdate( carreraDB._id, { estado : true, usuario: req.usuario._id, fecha_registro}, { new: true })
            return res.status(200).json({
                nombre: data.nombre,
                usuario:req.usuario._id,
                fecha_registro
            })
        } else{
            if (carreraDB._id!=id) {
                return res.status(400).json({
                    msg: `La carrera ${ carreraDB.nombre }, ya existe`
                });
            }


            
        }
       
    }




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