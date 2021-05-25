const { Schema, model} = require('mongoose');


const RedesSocialesInstructoreSchema= Schema({
   
     
    redSocial_id: {
        type: Schema.Types.ObjectId,
        ref: 'RedSocial',
        required:true,
    },


    instructor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor',
        required:true,
    },

    url: {
        type: String,
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
    
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
    },
    

});

RedesSocialesInstructoreSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('RedesSocialesInstructore',RedesSocialesInstructoreSchema);



