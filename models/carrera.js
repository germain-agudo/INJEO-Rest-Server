const { Schema, model } = require('mongoose');

const CarreaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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

CarreaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Carrera', CarreaSchema );
