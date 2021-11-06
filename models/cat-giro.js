
const { Schema, model } = require('mongoose');

const CatGiroSchema = Schema({
    giro: {
        type: String,
        required: [true, 'El giro es obligatorio']
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
CatGiroSchema.methods.toJSON = function() {
    const { __v, ...catGiro  } = this.toObject();
    return catGiro;
}

module.exports = model( 'CatGiro', CatGiroSchema );



