const { Schema, model } = require('mongoose');

const CatMunicipioSchema = Schema({
    municipio: {
        type: String,
        required: [true, 'El municipio es obligatorio']
    },
    estado_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatEstado',
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

CatMunicipioSchema.methods.toJSON = function() {
    const { __v, ...catMunicipio  } = this.toObject();
    return catMunicipio;
}

module.exports = model( 'CatMunicipio', CatMunicipioSchema );
