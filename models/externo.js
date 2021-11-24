const { Schema, model }= require('mongoose');

const ExternoSchema= Schema({
    
    tipoNegocio_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatTipoNegocio',
        required:true,        
    },
    
    giro_id: {
        type: Schema.Types.ObjectId,
        ref: 'CatGiro',
        required:true,        
    },

    
    titularempresa_id: {
        type: Schema.Types.ObjectId,
        ref: 'TitularesExterno',
        required:true,        
    },
    

    
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    rfc: {
        type: String,
        required: [true, 'El RFC es obligatorio']
    },





    pagina_web: {
        type: String,
        required: [true, 'La pagina_web es obligatoria']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    latitud: {
        type: String,
        required: [true, 'La latitud es obligatoria']
    },
    longitud: {
        type: String,
        required: [true, 'La longitud es obligatoria']
    },

    fecha_aceptacion: {
        type:  Date,          
    },
    aceptacion: {
        type: Boolean,
        default:false
    },
    comprobante_domicilio_pdf: {
        type: String,
        required: [true, 'El comprobante de ubicación es obligatoria']

    },
    convenio: {
        type: String
        
    },


    // tipo_persona: {
    //     type: String,
    //     required: [true, 'El tipo_persona es obligatoria']
    // },

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

ExternoSchema.methods.toJSON = function() {
    const { __v, ...externo  } = this.toObject();
    return externo;
}
module.exports = model('Externo', ExternoSchema);