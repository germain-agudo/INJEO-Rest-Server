const { response } = require('express');
const { CatCategoriaB } = require('../models')

const obtenerCatCategoriaBolsas = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    
    const query = { estado: true };




    const [ total, categoria_empleos ] = await Promise.all([
        CatCategoriaB.countDocuments(query),
        CatCategoriaB.find(query)
        .sort({fecha_registro:-1})
            .populate('usuario_id', {password:0, __v:0})
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        categoria_empleos
    });
}

const obtenerCatCategoriaBolsa = async(req, res = response ) => {

    const { id } = req.params;
    const categoria_empleo = await CatCategoriaB.findById( id )
                            .populate('usuario_id',  {password:0, __v:0}  );

    res.json( categoria_empleo );

}

const crearCatCategoriaBolsa = async(req, res = response ) => {
    const fecha_registro = Date.now();

   const { categoria}=req.body;

   const duplicado = await  CatCategoriaB.findOne({
       categoria : categoria.toUpperCase().trim(),
       estado: true
   })

if (duplicado) {
    return res.status(401).json({
        msg:`La categoria ${categoria} ya se encuentra registrado`
    })
}

    // Generar la data a guardar
    const data = {
        "categoria":categoria.toUpperCase().trim(),
        fecha_registro,
        usuario_id: req.usuario._id
    }
   

    
    const catcategoriaBolsa = new CatCategoriaB( data );
    // Guardar DB
    await catcategoriaBolsa.save();

    res.status(201).json(catcategoriaBolsa);

}

const actualizarCatCategoriaBolsa = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario_id, ...data } = req.body;

    data.categoria  = data.categoria.toUpperCase().trim();
    // data.usuario_id = req.usuario._id;


const catCategoriaEmpleoDb = await CatCategoriaB.findOne({    
    categoria : data.categoria,
    estado: true})
if (catCategoriaEmpleoDb && catCategoriaEmpleoDb._id != id) {
    return res.status(401).json({
            msg: `La categoria: ${ catCategoriaEmpleoDb }, ya existe`

    })
}

    const categoria_empleo_nuevo = await CatCategoriaB.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria_empleo_nuevo);

}

const borrarCatCategoriaBolsa = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();



    const { id } = req.params;



    const catcategoriaBolsa = await CatCategoriaB.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });

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
    res.json( catcategoriaBolsa );
}




module.exports = {
    obtenerCatCategoriaBolsas,
    crearCatCategoriaBolsa,
    obtenerCatCategoriaBolsa,
    actualizarCatCategoriaBolsa,
    borrarCatCategoriaBolsa,
}