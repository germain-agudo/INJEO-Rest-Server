const { Schema, model } = require("mongoose")

const BolsaTrabajoSchema = Schema({
    categoriabolsa_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatCategoriaBolsa',
        required:true,        
    },

    estado_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatEstado',
        required:true,        
    },

    municipio_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatMunicipio',
        required:true,        
    },

    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
       
    },
    requisitos: {
        type: String,
        required: [true, 'Los requisitos son obligatorios'],
                
    },
    fecha_inicio: {
        type:  Date,
        required: [true, 'La fecha_inicio es obligatoria'],
            
    },

    salario: {
        type: String,
        required: [true, 'El salario es obligatorio'],
               
    },

    beneficios: {
        type: String,
        required: [true, 'Los beneficios son obligatorios'],              
    },

    modalidad: {
        type: String,
        required: [true, 'La modalidad es obligatoria'],              
    },
    horario: {
        type: String,
        required: [true, 'El horario es obligatorio'],              
    },




    enlace: {
        type: String,
        required: [true, 'El enlace es obligatorio'],               
    },

    img: {
        type: String,      
    },


    estado: {
        type: Boolean,
        required: true,
        default:true,
       
    },
    fecha_registro: {
        type:  Date,
            
    },
    fecha_eliminacion: {
        type:  Date,
            
    },
    externo_id: {
        type: Schema.Types.ObjectId,
        ref: 'Externo',
        required:true,        
    },
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },
});  

BolsaTrabajoSchema.methods.toJSON =function () {
    const {__v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('BolsaTrabajo', BolsaTrabajoSchema);

