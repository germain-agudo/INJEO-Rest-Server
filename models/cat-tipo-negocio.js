

const { Schema, model } = require('mongoose');

const CatTipoNegocioSchema = Schema({
    tipo: {
        type: String,
        required: [true, 'El catNegocio_tipo es obligatorio']
    }

    , estado: {
        type: Boolean,
        default:true,
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


CatTipoNegocioSchema.methods.toJSON = function() {
    const { __v, ...catTipoNegocio  } = this.toObject();
    return catTipoNegocio;
}



module.exports = model( 'CatTipoNegocio', CatTipoNegocioSchema );









