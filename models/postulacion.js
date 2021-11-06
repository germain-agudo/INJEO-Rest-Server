const { Schema, model } = require('mongoose');

const PostulacionSchema = Schema({
   
    curriculum_url: {
        type: String,
        required: [true, 'El Curriculum vitae es obligatorio']
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
