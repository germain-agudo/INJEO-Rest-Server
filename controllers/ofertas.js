const { response } = require('express');
const { Oferta, Carrera, Escuela} = require('../models');





const obtenerOfertas = async(req, res = response ) => {   

     const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, ofertas ] = await Promise.all([
        Oferta.countDocuments(query),
        Oferta.find(query)
            .populate('usuario', 'nombre')
            .populate('escuela', 'nombre')
            .populate('carrera', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        ofertas
    }); 
}

const obtenerOferta = async(req, res = response ) => {
    const { id } = req.params;
    const oferta = await Oferta.findById( id )
                                 .populate('usuario', 'nombre')
                                 .populate('escuela', 'nombre')
                                 .populate('carrera', 'nombre')
    res.json( oferta );
} 





const crearOferta = async(req, res = response ) => {

  const {carrera_id, escuela_id} = req.body;
    
  const [ carreraDB, escuelaDB ] = await Promise.all([
        Carrera.findById(carrera_id),
        Escuela.findById(escuela_id)
    ]);        
    
    const descripcion = `${escuelaDB.nombre}-${carreraDB.nombre}`.toUpperCase();  
    
    const descripcionDB = await Oferta.findOne({descripcion});

    if (descripcionDB) {
        return res.status(400).json({
            msg:`La relación entre las entidades ${descripcion} ya existe`
        });
    }
   


   
        // Generar la data a guardar
       const data = {
            descripcion,
            carrera:carreraDB._id,
            escuela:  escuelaDB._id,
            usuario: req.usuario._id
       }   
   

    const oferta = new Oferta(data);
    await oferta.save();
    res.status(201).json(oferta);


}

const actualizarOferta = async( req, res = response ) => {
    // res.json( req.params);
    const { id } = req.params;
    const {carrera_id,escuela_id} = req.body;
    // const { estado, usuario, descripcion, carrera_id, escuela_id,...data } = req.body;
    


    const [ carreraDB, escuelaDB ] = await Promise.all([    
          Carrera.findById(carrera_id),
          Escuela.findById(escuela_id)
      ]);        




      const descripcion = `${escuelaDB.nombre}-${carreraDB.nombre}`.toUpperCase();      

     

      
      const descripcionDB = await Oferta.findOne({descripcion});
  
      if (descripcionDB&&descripcionDB.id!==id) {
          return res.status(400).json({
              msg:`La relación entre las entidades ${descripcion} ya existe`
          });
      }
    
    

const data ={
    descripcion,
    carrera:carrera_id,
    escuela:escuela_id,
    usuario: req.usuario._id

}



    

    const oferta = await Oferta.findByIdAndUpdate(id, data, { new: true });
    res.json( oferta); 
  
   

}
 
const borrarOferta = async(req, res =response ) => {

    const { id } = req.params;
    const ofertaBorrada = await Oferta.findByIdAndUpdate( id, { estado: false }, {new: true });
    res.json( ofertaBorrada );
}




module.exports = {
    crearOferta,
    obtenerOfertas,
    obtenerOferta,
    actualizarOferta,
    borrarOferta,
}