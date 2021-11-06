const { Schema, model } = require('mongoose');

const CatCategoriaBolsaSchema = Schema({
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

CatCategoriaBolsaSchema.methods.toJSON = function() {
    const { __v, ...catcategoriaBolsa  } = this.toObject();
    return catcategoriaBolsa;
}

module.exports = model( 'CatCategoriaBolsa', CatCategoriaBolsaSchema );
