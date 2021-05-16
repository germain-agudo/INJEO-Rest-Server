const { Schema, model } = require("mongoose")

const BolsaTrabajoSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción'],
       
    },
    requerimientos: {
        type: String,
        required: [true, 'Los requerimientos son obligatorios'],
               
    },
    enlace: {
        type: String,
        required: [true, 'El enlace es obligatorio'],               
    },

    img: {
        type: String,      
    },

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },

});  

BolsaTrabajoSchema.methods.toJSON =function () {
    const {_v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('BolsaTrabajo', BolsaTrabajoSchema);

