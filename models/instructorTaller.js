const { Schema, model} = require('mongoose');


const InstructorTallereSchema= Schema({
   
    Taller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Taller',
        required:true,
    },

    instructor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor',
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

InstructorTallereSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('InstructorTallere',InstructorTallereSchema);



