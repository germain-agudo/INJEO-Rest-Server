const { Schema, model }= require('mongoose');

const ExternoSchema= Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    rfc: {
        type: String,
        required: [true, 'El RFC es obligatorio']
    },

    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
     numero_telefonico: {
        type: String,
        required: [true, 'El numero telefonico es obligatorio']
    }, 
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        // emun: ['ADMIN_ROLE', 'USER_ROLE']
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
});

ExternoSchema.methods.toJSON = function() {
    const { __v, password,...externo  } = this.toObject();
    return externo;
}
module.exports = model('Externo', ExternoSchema);