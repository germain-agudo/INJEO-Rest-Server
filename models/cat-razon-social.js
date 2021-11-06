
const { Schema, model } = require('mongoose');

const CatRazonSocialSchema = Schema({

    externo_id: {
        type: Schema.Types.ObjectId,
        ref: 'Externo',
        required:true,        
    },

    razon_social: {
        type: String,
        required: [true, 'La razon_social obligatorio']
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

CatRazonSocialSchema.methods.toJSON = function() {
    const { __v, ...carRazonSocial  } = this.toObject();
    return carRazonSocial;
}

module.exports = model( 'CatRazonSociale', CatRazonSocialSchema );



