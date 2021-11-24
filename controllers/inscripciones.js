const { response } = require('express');
const { Taller, Usuario, Inscripccion, Oferta} = require('../models');






const obtenerInscripciones = async(req, res = response ) => {   

     const { limite = 5, desde = 0 , estatus = 'todos'} = req.query;
let query;
switch (estatus) {
    case 'esperando':
     query = { estado: true,    aprobado: false };

        break;
    case 'aprobados':

        query = { estado: true, aprobado: true };

            break;

    default:
       query = { estado: true };
       break;
} 

    
    
    //  const query = { estado: true };

    const [ total, inscripciones ] = await Promise.all([
        Inscripccion.countDocuments(query),
        Inscripccion.find(query)
            .populate('usuario', 'user_name')
            .populate('taller', 'titulo')
            .populate('responsable_registro', 'user_name')

          

           
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
                                        .populate('usuario', 'user_name')
                                        .populate('taller', 'titulo')
                                        .populate('responsable_registro', 'user_name')
                            
    res.json( inscripcion );
} 








const crearInscripcion = async(req, res = response ) => {
    const fecha_registro = Date.now();

  const {participante_id, taller_id} = req.body; 

  const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([
        // Inscripccion.find({usuario:participante_id, taller:taller_id, estado:true}            
        Inscripccion.findOne({usuario:participante_id, taller:taller_id, estado:true}            
            ),
        Usuario.findById(participante_id),
        Taller.findById(taller_id)
    ]);        
    
    const descripcion = `${participanteDB.user_name} - ${tallerDB.titulo}`.toUpperCase();    

    if (inscripcionDB) {
     return   res.status(401).json({
            msg:`Actualmente: ${participanteDB.user_name}, es participante  en el taller: ${tallerDB.titulo}`,
        })
    }
    
    
    



    // const resultados=( inscripcionDB) ? [ inscripcionDB] :[]     

/*    if (inscripcionDB.length>0) {   
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
            msg:`Actualmente ${participanteDB.user_name} es participante  en el taller ${tallerDB.titulo}`,
        });   
       } 
} */   

        // Generar la data a guardar
       const data = {
            descripcion,
            usuario:participanteDB._id,
            taller:  tallerDB._id,
            responsable_registro: req.usuario._id,    
            fecha_registro     
       }   



    //    console.log(tallerDB.cupo);
       if ( tallerDB.cupo <1 ) {
        return res.status(401).json({
            msg: `EL cupo del taller: ${ tallerDB.titulo } llegó a su limite `
        }); 
       }

       const cupoNuevo = tallerDB.cupo - 1;
    //    console.log(tallerDB._id);
    await Taller.findByIdAndUpdate(tallerDB._id, {cupo: cupoNuevo }, {new:true} );
    const inscripcion = new Inscripccion(data);
    await inscripcion.save();
    res.status(201).json(inscripcion);

}

const actualizarInscripcion = async( req, res = response ) => {
    // const fecha_registro = Date.now();
    const { id } = req.params;
    const {participante_id, taller_id} = req.body;    
    // const { estado, usuario, descripcion, carrera_id, escuela_id,...data } = req.body;
    const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([    
            Inscripccion.findOne({ usuario: participante_id, taller:taller_id, estado:true}),
            Usuario.findById(participante_id),
            Taller.findById(taller_id)
      ]);        
      const descripcion = `${participanteDB.user_name} - ${tallerDB.titulo}`.toUpperCase();        
/*       const descripcionDB = await Inscripccion.findOne({descripcion});
      if (descripcionDB&&descripcionDB.id!==id) {
          return res.status(400).json({
              msg:`La relación entre las entidades ${descripcion} ya existe`
          });
      } */
      const inscripcion_id = await  Inscripccion.findById(id);
      let permiso = true;
      (inscripcion_id.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
      
      if (!permiso ) {    
          return res.status(401).json({
              msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
          }); 
      }

      if (inscripcionDB && inscripcionDB._id!=id ) {
        //   console.log('Ya existe');
          return   res.status(401).json({
            msg:`Actualmente: ${participanteDB.user_name}, es participante  en el taller: ${tallerDB.titulo}`,
        });
      }
/*       if (inscripcionDB.length>0) {    
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
            msg:`Actualmente ${participanteDB.user_name} es participante  en el taller ${tallerDB.titulo}`,                 
                                           }); 
            }               
        }
    } */

const data ={
    descripcion,
    usuario:participanteDB._id, 
    taller:  tallerDB._id,
    responsable_registro: req.usuario._id,   
    // fecha_registro    

}

    const inscripcion = await Inscripccion.findByIdAndUpdate(id, data, { new: true });
    res.json( inscripcion); 

}
 
const borrarInscripcion = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const {id} = req.params;
    const inscripcion_id = await  Inscripccion.findById(id);
    let permiso = true;
    (inscripcion_id.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
    // console.log(inscripcion_id.taller._id);
const taller = await Taller.findById(inscripcion_id.taller._id);

    const cupoNuevo = taller.cupo + 1;
    // const { id } = req.params;
    const inscripcionBorrada = await Inscripccion.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });
    await Taller.findByIdAndUpdate(taller._id, {cupo: cupoNuevo }, {new:true} );

    res.json( inscripcionBorrada );
    


}




const cambiarEstatusInscrito = async(req, res = response)=>{
    const { id } = req.params;
    const inscripcion = await Inscripccion.findById(id);

    if (inscripcion.aprobado) {
        inscripcion.aprobado= false;
        inscripcion.save()
    }else if(!inscripcion.aprobado){
        inscripcion.aprobado= true;
        await inscripcion.save()

    }
    return res.status(201).json(inscripcion)
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    
    const { estatus = 'todos'} = req.query;
   

    switch (coleccion) {
        case 'talleres':
               buscarUsuariosPorTaller(id, res, estatus);
             
            break;
    
        case 'usuarios':
               buscarTalleresPorUsuario(id,res, estatus);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarUsuariosPorTaller=async(id= '', res= response, estatus='')=>{
        
        let query;
        switch (estatus) {
            case 'esperando':
             query = { estado: true, taller:id,    aprobado: false };
        
                break;
            case 'aprobados':
                query = { estado: true, taller:id, aprobado: true };
        
                    break;
        
            default:
               query = { estado: true, taller:id };
               break;
        } 

    // const query={estado:true, taller:id};
        const [taller,total,usuarios]= await Promise.all( [
                Taller.findById(id),
                Inscripccion.countDocuments(query),
                Inscripccion.find(query, {usuario:1, aprobado:1})     
                // Inscripccion.find({estado:true, taller:id}, {usuario:1, aprobado:1})     
                                    // .populate('usuario',['user_name'])                                
                                    .populate('usuario',{password:0, __v:0})
                                
            ]);
    
            if (!taller || !taller.estado) {
                return  res.status(401).json({
                msg: `El taller: ${id}, no existe`
                });        
            }
    
        return res.json({
            'taller': taller.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:usuarios,
        });    
    }
    
    const buscarTalleresPorUsuario=async(id= '', res= response, estatus='')=>{
    
        let query;
        switch (estatus) {
            case 'esperando':
             query = { estado: true, usuario:id,    aprobado: false };
        
                break;
            case 'aprobados':
                query = { estado: true, usuario:id, aprobado: true };
        
                    break;
        
            default:
               query = { estado: true, usuario:id };
               break;
        } 




    // const query={estado:true, usuario:id};
    
        const [usuario, total, talleres]= await Promise.all( [
                Usuario.findById(id),
                Inscripccion.countDocuments(query),
                Inscripccion.find(query, {taller:1, aprobado:1})     
                // Inscripccion.find({estado:true, usuario:id}, {taller:1, aprobado:1})     
                                    // .populate('taller',['titulo'])
                                    // .populate('taller',{ __v:0})
                                    .populate({
                                        path: 'taller',
                                        select:{__v:false, },
                                        populate:{
                                            path :'usuario',
                                            select:{__v:false, password:false, }  
                                                 }
                                    })

            ]);
    
            if (!usuario || !usuario.estado) {
                return res.status(401).json({
                msg: `El usuario ${id}, no existe`
                });        
            }
    
        return res.json({
            'usuario': usuario.user_name,
            total,
            results:talleres,
        });    
    }
    
    
    







module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerInscripcion,
    actualizarInscripcion,
    borrarInscripcion,
    buscarRelacion,
    cambiarEstatusInscrito
}