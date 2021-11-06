const {response, request} = require('express');


const {RedExterno,  RedSocial ,  Externo, }= require('../models/index');

/**
 *  Obtener Todas 
 */
 const obtenerRedesExternos = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, redesEmpresas] = await Promise.all([
        RedExterno.countDocuments(query),
        RedExterno.find(query)
                        .populate('red_id',['red'])
                        .populate('externo_id',['nombre'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
         redesEmpresas
    });    
    }

/**
 *  Obtener 
 */
const obtenerRedExterno = async(req, res= response)=>{
    const {id}= req.params;
    const redExterno = await RedExterno.findById(id)
                                                        
                                                        .populate('red_id',['red'])
                                                        .populate('externo_id',['nombre'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(redExterno);    
}

/** 
 *  Crear
 */

const crearRedExterno = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {red_id ,usuario_empresa_id , url}= req.body;   




    const externo = await Externo.findOne({usuario_id:usuario_empresa_id, estado:true})
    // Generar la data a guardar
    if (! externo) {
        return res.status(401).json({
            msg: `EL id ${ usuario_empresa_id } No cuenta con los permisos necesarios - No es una empresa`
        });  
    }




const redExternoDB = await RedExterno.findOne({red_id, externo_id: externo._id, url, estado:true}).populate('red_id',['red']).populate('externo_id',['nombre']);
if (redExternoDB) {
    //   console.log(redInstructorDB.red_id);
      const{red} = redExternoDB.red_id;
      const{ nombre } = redExternoDB.externo_id;
    return res.status(401).json({
        msg: `La empresa: ${ nombre }, ya cuenta con la red: ${ red}: ${url} - No puede hacer esto`
    }); 
}



    const data = {
        red_id,
        externo_id: externo._id,
        url,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const redExterno = new RedExterno(data);
                   await redExterno.save();      
    res.status(201).json(redExterno);
}

/**
 *  Actualizar
 */
const actualizarRedExterno = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { url }= req.body;
// const urlDB = await RedExterno.findById(id);
const data = {  url: url.trim()}
   const redExterno = await RedExterno.findByIdAndUpdate(id,data, {new:true});
res.json(redExterno);    
}

 
/**
 *  Eliminar 
 */
const eliminarRedExterno = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const redExternoDB = await  RedExterno.findById(id);

let permiso = true;
(redExternoDB.externo_id._id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const redExterno = await RedExterno.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(redExterno);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'redes':
               buscarEmpresasPorRed(id, res);
             
            break;
    
        case 'empresas':
               buscarRedesPorEmpresa(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarEmpresasPorRed=async(id= '', res= response)=>{
    
    const query={estado:true, red_id:id};
        const [red,total,empresas]= await Promise.all( [
                RedSocial.findById(id),
                RedExterno.countDocuments(query),
                RedExterno.find({estado:true, red_id:id}, {externo_id:1,url:1,})     
                                    .populate('externo_id',['nombre'])                                
            ]);
    
            if (!red || !red.estado) {
                return res.status(401).json({
                msg: `La red: ${id}, no existe`
                });        
            }
    
        return res.json({
            'Red': red.red,
            total,
            // results:(carreras) ? [carreras] :[],
            results:empresas,
        });    
    }
    
    const buscarRedesPorEmpresa=async(id= '', res= response)=>{
    
    const query={estado:true, externo_id:id};
    
        const [externo,total,redes]= await Promise.all( [
                Externo.findById(id),
                RedExterno.countDocuments(query),
                RedExterno.find({estado:true, externo_id:id}, {red_id:1,url:1})     
                .sort({fecha_registro:-1})
                                    
                // .populate('red_id',['red','img'])     
                .populate([{
                    path: 'red_id',
                   select:{__v:false},
                        populate:{
                            path:'usuario_id',
                            select:{__v:false, password:false}
                            
                        }
                }])                           
            ]);
    
            if (!externo || !externo.estado) {
                return res.status(401).json({
                msg: `La empresa ${id}, no existe`
                });        
            }
    
        return res.json({
            'empresa': externo.nombre,
            total,
            results:redes,
        });    
    }
    
    
    






module.exports={
        obtenerRedesExternos,
        obtenerRedExterno,
          crearRedExterno,
     actualizarRedExterno,
       eliminarRedExterno,
        buscarRelacion
}



