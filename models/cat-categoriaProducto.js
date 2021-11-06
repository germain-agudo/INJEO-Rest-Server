const { Schema, model } = require('mongoose');

const CatCategoriaProductoSchema = Schema({
    categoria: {
        type: String,
        required: [true, 'La categoria es obligatorio']
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

CatCategoriaProductoSchema.methods.toJSON = function() {
    const { __v, ...catcategoriaProducto  } = this.toObject();
    return catcategoriaProducto;
}

module.exports = model( 'CatCategoriaProducto', CatCategoriaProductoSchema );
