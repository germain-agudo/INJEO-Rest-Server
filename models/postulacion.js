const { Schema, model } = require('mongoose');

const PostulacionSchema = Schema({
   
    curriculum_url: {
        type: String,
        required: [true, 'El Curriculum vitae es obligatorio']
    },
    estatus: {
        type: Number,
        required: [true, 'El estatus de la solicitud es oblogatoria'],
        default:1


    },
    msg: {
        type: String,
        required: [true, 'El mensaje de solicitud es obligatorio'],
        default: 'Su solicitud está siendo analizada y valorada, espere, por favor'
    },
    usuariojoven_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
        
    },

    // externo_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Externo',
    //     required:true,
        
    // },

    bolsa_id: {
        type: Schema.Types.ObjectId,
        ref: 'BolsaTrabajo',
        required:true,
        
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

PostulacionSchema.methods.toJSON = function() {
    const { __v, ...postulacion  } = this.toObject();
    return postulacion;
}

module.exports = model( 'Postulacione', PostulacionSchema );
