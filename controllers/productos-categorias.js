

const {response, request} = require('express');

const {Producto, }= require('../models/index');




const obtenerProductosPorCategoria = async ( req, res = response)=>{
    const {id}= req.params;
    const query={categoria_id: id, estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .sort({fecha_registro:-1})

                        // .populate('usuario_id',{password:0, __v:0})
                        .populate(
                            [
                                {
                                    path: 'empresa_id',
                                    select:{__v:false},
                                    // populate:{
                                    //     path :'usuario_id',
                                    //     select:{__v:false, password:false}                       
                                    // }        
                                    populate:
                                    [ 
                                        {
                                            path :'usuario_id',
                                            select:{__v:false, password:false, }                       
                                        }, 
                                        {
                                            path :'titularempresa_id',
                                            select:{__v:false,}        
                                            , populate:{
                                                path :'usuario_id',
                                                select:{__v:false, password:false}                       
                                            }                 
                                        }, 
                                        {
                                            path :'tipoNegocio_id',
                                            select:{__v:false,} ,
                                            populate:{
                                                path :'usuario_id',
                                                select:{__v:false, password:false}                       
                                            }                        
                                        }, 
                                        {
                                            path :'giro_id',
                                            select:{__v:false, } ,
                                            populate:{
                                                path :'usuario_id',
                                                select:{__v:false, password:false}                       
                                            }                        
                                        }, 
                                    
                                    ],    
                                }
                                ,
                                {
                                    path: 'categoria_id',
                                    select:{__v:false},
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false}                       
                                    }           
                                }
    
    
                            ]
                        )



                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        productos
    });    

}


module.exports={
    obtenerProductosPorCategoria
}
