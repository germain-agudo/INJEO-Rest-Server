const { Schema, model}  = require('mongoose');


const ServicioSocialSchema = Schema({
    nombre_programa: {
        type: String,
        required: [true, 'El nombre o titulo del programa es obligatorio'],
       
    },

    dependencia:{
        type:String,
        required: [true,'El la dependencia o el lugar es obligatorio']
    },
    
    perfil: {
        type: String,
        required: [true, 'El perfil del prestador o practicante es obligatorio'],
      
    },

    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
      
    },
    nombre_responsable: {
        type: String,
        required: [true, 'nombre_responsable'],
       
    },   

    correo_responsable: {
        type: String,
        required: [true, 'El correo del responsable es obligatorio'],
       
    },
    telefono_responsable: {
        type: String,
        required: [true, 'El número telefonico del responsable es obligatorio'],
       
    },

    img: {
        type: String,
       
    },



    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_registro: {
        type:  Date,
            
    },
    fecha_eliminacion: {
        type:  Date,
    }
});


ServicioSocialSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'serviciossociale' , ServicioSocialSchema);




