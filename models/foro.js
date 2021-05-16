const { Schema, model } = require("mongoose")

const ForoSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },


    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },

});

ForoSchema.methods.toJSON =function () {
    const {_v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('Foro', ForoSchema);

