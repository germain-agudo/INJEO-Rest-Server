const { Schema, model } = require('mongoose');

const TallerSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
       
    },
    subtitulo: {
        type: String,
        required: [true, 'El subtitulo es obligatorio'],
      
    },
    img: {
        type: String,
       
    },


    descripcion:{
        type: String,
        required:true,

    },

    enlace:{
        type: String,
        required:[true, 'El enlace es obligatorio'],

    },
/*     fecha:{
        type: String,
        default:new Date().toISOString(), 

    }, */

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_registro: {
        type:  Date,
            
    },
});


TallerSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Taller', TallerSchema );
