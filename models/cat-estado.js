const { Schema, model } = require('mongoose');

const CatEstadoSchema = Schema({
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio']
    },
    activo: {
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

CatEstadoSchema.methods.toJSON = function() {
    const { __v, ...catEstado  } = this.toObject();
    return catEstado;
}

module.exports = model( 'CatEstado', CatEstadoSchema );
