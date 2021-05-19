const {response, request}= require('express');

//  El object id es para saber si es un MOngoID
const {ObjectId}= require('mongoose').Types;

const {
    Apoyo,
    Beca,
    BolsaTrabajo,
    Carrera,
    Convocatoria,
    Escuela,
    Externo,
    Foro,
    Inscripccion,
    Usuario,
    Noticia,
    Oferta,
    Persona,
    Taller,
}= require('../models/index');

const coleccionesPermitidas=[
    'apoyos',
    'becas',
    'bolsaTrabajos',
    'carreras',
    'convocatorias',
    'escuelas',
    'externos',
    'foros',
    'inscripciones',
    'usuarios',
    'noticias',
    'ofertas',
    'personas',
    'talleres'

];

const buscarUsuarios= async(termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid( termino );//true

    if (esMongoID) {
            const usuario = await Usuario.findById(termino);
            res.json({
                results: ( usuario ) ? [ usuario] :[]
            });
    }
}





const buscar =(req= request, res= response)=>{
        const { coleccion, termino}= req.params;

if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
        msg:`Las colecciones permitidas son: '${ coleccionesPermitidas }'`,
    });
}

switch (coleccion) {
    
    case 'usuarios':
            buscarUsuarios(termino, res)
        break;
    case 'personas':

        break;
    case 'externos':

        break;
    case 'apoyos':

        break;
    case 'becas':

        break;
    case 'bolsaTrabajos':

        break;
    case 'carreras':

        break;
    case 'convocatorias':

        break;
    case 'escuelas':

        break;
    case 'foros':

        break;
    case 'inscripciones':

        break;
    case 'noticias':

        break;
    case 'ofertas':

        break;
    case 'talleres':

        break;

    default:
        res.status(500).json({
            msg:'Esta búsqueda se encuentra en desarollo o no existe'
        });


}

}



module.exports={
    buscar,
}
