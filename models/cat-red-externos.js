const { Schema, model} = require('mongoose');


const RedesSocialesEmpresaSchema= Schema({
   
    
    red_id: {
        type: Schema.Types.ObjectId,
        ref: 'RedesSociale',
        required:true,
    },

 
    externo_id: {
        type: Schema.Types.ObjectId,
        ref: 'Externo',
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

RedesSocialesEmpresaSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('RedesSocialesEmpresa',RedesSocialesEmpresaSchema);



