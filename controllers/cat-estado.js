const { response } = require('express');
const { CatEstado } = require('../models')

const obtenerCatEstados = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { activo: true };

    const [ total, estados ] = await Promise.all([
        CatEstado.countDocuments(query),
        CatEstado.find(query)
        .sort({fecha_registro:-1})
            .populate('usuario_id', {password:0, __v:0})
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        estados
    });
}

const obtenerCatEstado = async(req, res = response ) => {

    const { id } = req.params;
    const estado = await CatEstado.findById( id )
                            .populate('usuario_id',  {password:0, __v:0}  );

    res.json( estado );

}

const crearCatEstado = async(req, res = response ) => {
    const fecha_registro = Date.now();

   const { estado}=req.body;

   const duplicado = await  CatEstado.findOne({
       estado : estado.toUpperCase().trim(),
       activo: true
   })

if (duplicado) {
    return res.status(401).json({
        msg:`El estado ${estado} ya se encuentra registrado`
    })
}

    // Generar la data a guardar
    const data = {
        "estado":estado.toUpperCase().trim(),
        fecha_registro,
        usuario_id: req.usuario._id
    }
   

    
    const catEstado = new CatEstado( data );
    // Guardar DB
    await catEstado.save();

    res.status(201).json(catEstado);

}

const actualizarCatEstado = async( req, res = response ) => {

    const { id } = req.params;
    const { activo, usuario_id, ...data } = req.body;

    data.estado  = data.estado.toUpperCase().trim();
    // data.usuario_id = req.usuario._id;


const catEstadoDb = await CatEstado.findOne({    
    estado : data.estado.toUpperCase().trim(),
    activo: true})
if (catEstadoDb && catEstadoDb._id != id) {
    return res.status(401).json({
            msg: `El estado: ${ catEstadoDb.estado }, ya existe`

    })
}





    const estado = await CatEstado.findByIdAndUpdate(id, data, { new: true });

    res.json( estado);

}

const borrarCatEstado = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();



    const { id } = req.params;



    const catEstadoBorrado = await CatEstado.findByIdAndUpdate( id, { activo: false, fecha_eliminacion }, {new: true });

    // const [convocatoriaBorrada,convocatoriaImagen]= await Promise.all([
    //     Convocatoria.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true }),

    //     ConvocatoriaImg.find({ convocatoria_id:id, estado:true
    //             }).then((cI)=>{
    //                 if (cI.length>0) {
    //                     cI.forEach(async (i)=>{ 
    //                         await ConvocatoriaImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
    //                     })
    //                 }
    //             })
        
    // ])
    res.json( catEstadoBorrado );
}




module.exports = {
    obtenerCatEstados,
    crearCatEstado,
    obtenerCatEstado,
    actualizarCatEstado,
    borrarCatEstado,
}