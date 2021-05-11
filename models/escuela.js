const { Schema, model } = require('mongoose');

const EscuelaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la escuela es obligatorio']
    },
    imagen: {
        type: String,
        
    },
    estado: {
        type: Boolean,
        default:true,
        required:true,
        
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});
EscuelaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Escuela', EscuelaSchema );
