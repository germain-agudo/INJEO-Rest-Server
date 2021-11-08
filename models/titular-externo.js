const { Schema, model }= require('mongoose');

const titularExternoSchema= Schema({
    nombre: {
        type: String,
        required: [true, 'nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido paterno es obligatorio']
    },
 
    curp: {
        type: String,
        required: [true, 'La CURP es obligatoria']
    },
    ine_url: {
        type: String,
        // required: [true, 'El INE es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    correo_electronico: {
        type: String,
        required: [true, 'El correo_electronico es obligatoria']
    },
    numero_telefonico: {
        type: String,
        required: [true, 'El número_telefonico  es obligatoria']
    },

    // edad: {
    //     type: String,
    //     required: [true, 'La edad es obligatoria']
    // },
    // sexo: {
    //     type: String,
    //     required: [true, 'El sexo es obligatorio'],
    //     // emun: ['Masculino', 'Femenino']

     
    // },

    // fecha_nacimiento: {
    //     type: String,
    //     required: [true, 'La fecha de nacimiento es obligatoria']
    // },
    // municipio: {
    //     type: String,
    //     required: [true, 'El municipio es obligatorio']
    // },
    
    // region: {
    //     type: String,
    //     required: [true, 'El region es obligatoria']
    // },
    estado: {
        type: Boolean,
        default:true,
    },

  /*   numero_telefonico: {
        type: String,
        required: [true, 'El numero telefonico es obligatorio']
    },  */
    
    fecha_registro: {
        type:  Date,
            
    },
 
    fecha_eliminacion: {
        type:  Date,
            
    }, 

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }

});

titularExternoSchema.methods.toJSON = function() {
    const { __v, ...titularExterno  } = this.toObject();
    return titularExterno;
}
module.exports = model('TitularesExterno', titularExternoSchema);   