const { response } = require('express');
const { Taller, Usuario, Inscripccion, Oferta} = require('../models');





const obtenerInscripciones = async(req, res = response ) => {   

     const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, inscripciones ] = await Promise.all([
        Inscripccion.countDocuments(query),
        Inscripccion.find(query)
            .populate('usuario', 'nombre')
            .populate('taller', 'titulo')
            .populate('responsable_registro', 'nombre')

          

           
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        inscripciones
    }); 
}

const obtenerInscripcion = async(req, res = response ) => {
    const { id } = req.params;
    const inscripcion = await Inscripccion.findById( id )
                                        .populate('usuario', 'nombre')
                                        .populate('taller', 'titulo')
                                        .populate('responsable_registro', 'nombre')
                            
    res.json( inscripcion );
} 








const crearInscripcion = async(req, res = response ) => {
    const fecha_registro = Date.now();

  const {participante_id, taller_id} = req.body;    
  const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([
        // Inscripccion.find({usuario:participante_id, taller:taller_id, estado:true}            
        Inscripccion.find({usuario:participante_id, taller:taller_id}            
            ),
        Usuario.findById(participante_id),
        Taller.findById(taller_id)
    ]);        
    
    const descripcion = `${participanteDB.nombre} - ${tallerDB.titulo}`.toUpperCase();    

       
    // const resultados=( inscripcionDB) ? [ inscripcionDB] :[] 
    

   if (inscripcionDB.length>0) {   

       if (!inscripcionDB[0].estado) {

        await Inscripccion.findByIdAndUpdate( inscripcionDB[0]._id, { estado: true , responsable_registro: req.usuario._id, fecha_registro, descripcion},{new:true});
       console.log(fecha_registro);
        return res.status(200).json({
            descripcion,
            usuario:participanteDB._id,
            taller:  tallerDB._id,
            responsable_registro: req.usuario._id, 
            fecha_registro,
        }); 
       

       } else{
        return res.status(400).json({
            msg:`Actualmente ${participanteDB.nombre} es participante  en el taller ${tallerDB.titulo}`,
        });   
       } 





}   

        // Generar la data a guardar
       const data = {
            descripcion,
            usuario:participanteDB._id,
            taller:  tallerDB._id,
            responsable_registro: req.usuario._id,    
            fecha_registro     
       }   

    const inscripcion = new Inscripccion(data);
    await inscripcion.save();
    res.status(201).json(inscripcion);

}

const actualizarInscripcion = async( req, res = response ) => {
    const fecha_registro = Date.now();

  
    const { id } = req.params;
    const {participante_id, taller_id} = req.body;    

    // const { estado, usuario, descripcion, carrera_id, escuela_id,...data } = req.body;
    

















    

    const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([    
            Inscripccion.find({ usuario: participante_id, taller:taller_id}),
        Usuario.findById(participante_id),
          Taller.findById(taller_id)
      ]);        



      const descripcion = `${participanteDB.nombre} - ${tallerDB.titulo}`.toUpperCase();        
      
/*       const descripcionDB = await Inscripccion.findOne({descripcion});
      if (descripcionDB&&descripcionDB.id!==id) {
          return res.status(400).json({
              msg:`La relación entre las entidades ${descripcion} ya existe`
          });
      } */
    
    
      if (inscripcionDB.length>0) {
    
        if (!inscripcionDB[0].estado) {
            await Inscripccion.findByIdAndUpdate(inscripcionDB[0]._id,{estado:true, responsable_registro:req.usuario._id, fecha_registro, descripcion}, {new: true} );
            return res.status(200).json({
                descripcion,
                usuario:participanteDB._id,
                taller:  tallerDB._id,
                responsable_registro: req.usuario._id,    
                fecha_registro   
                
            })
        } else {
           
            if (inscripcionDB[0]._id!=id) {
                return res.status(400).json({
                    
            msg:`Actualmente ${participanteDB.nombre} es participante  en el taller ${tallerDB.titulo}`,
                    
                    
                        
                    }); 
            }  

             
        }

    }






const data ={
    descripcion,
    usuario:participanteDB._id, 
    taller:  tallerDB._id,
    responsable_registro: req.usuario._id,   
    fecha_registro    

}





    const inscripcion = await Inscripccion.findByIdAndUpdate(id, data, { new: true });
    res.json( inscripcion); 
  
   

}
 
const borrarInscripcion = async(req, res =response ) => {


    const { id } = req.params;
    const inscripcionBorrada = await Inscripccion.findByIdAndUpdate( id, { estado: false }, {new: true });
    res.json( inscripcionBorrada );
    
}




module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerInscripcion,
    actualizarInscripcion,
    borrarInscripcion,
}