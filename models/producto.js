const { Schema, model, mongo } = require('mongoose');

const ProductoSchema = Schema({

    empresa_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
        
    },

    categoria_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatCategoriaProducto',
        required:true,
    },

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
       
    },

    precio_original: {
        // type: mongo.Decimal128,
        type: Number,
        required: [true, 'El nombre es obligatorio'],
       
    },

    descuento: {
        type: Number,
        required: [true, 'El nombre es obligatorio'],
       
    },
    precio_final: {
        // type: mongo.Decimal128,
        type: String,
        required: [true, 'El nombre es obligatorio'],
       
    },
    fecha_inicio: {
        type:  Date,
        // type:  String,
            
    },
    fecha_fin: {
        type:  Date,
        // type:  String,

            
    },
    
    estado: {
        type: Boolean,
        default: true
    },   

    fecha_registro: {
        type:  Date,
            
    },
    fecha_eliminacion: {
        type:  Date,
            
    },
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },
});




ProductoSchema.methods.toJSON = function() {
    const { __v, ...postulacion  } = this.toObject();
    return postulacion;
}

module.exports = model( 'Producto', ProductoSchema );
