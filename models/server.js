const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

const fileUpload = require('express-fileupload'); //subir archivos

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;


    
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',



            noticias: '/api/noticias',
            convocatorias: '/api/convocatorias',
            talleres: '/api/talleres',
            inscripcines: '/api/inscripciones',
            
            carreras: '/api/carreras',
            escuelas: '/api/escuelas',
            ofertas:  '/api/ofertas',

            becas:    '/api/becas',
            apoyos:   '/api/apoyos',


            bolsas:   '/api/bolsas',
            foros:   '/api/foros',
            

            usuarios:   '/api/usuarios',
            externos: '/api/externos',
            personas: '/api/personas',

            redes: '/api/redes',




            // productos:  '/api/productos',

            uploads:    '/api/uploads',

            images:    '/api/images',

            convocatoriaIMG:    '/api/convocatorias-imgs',
            noticiaIMG:    '/api/noticias-imgs',
            tallerIMG:    '/api/talleres-imgs',

            instructores:    '/api/instructores',
            participantes:    '/api/participantes',

            instructorTaller: '/api/instructores-talleres',
            participantesNoticias: '/api/participantes-noticias',
            
            redesInstructores: '/api/redes-instructores',
            redesParticipantes: '/api/redes-participantes',

            usuariosForos: '/api/comentarios-foros',

            webinars :'/api/webinars',


            servicioSocial : '/api/servicio-social',
            practicasProfesionales : '/api/practicas-profesionales',

            catEstados: '/api/estados',
            catGiros: '/api/giros',
            catMunicipios : '/api/municipios',
            catTipoNegocios: '/api/tipo-negocios',
            titularesExternos:'/api/titulares-empresas',
            aceptacionEmpresa:'/api/aceptacion-empresas',
            catCategoriasProductos:'/api/categorias-productos',
            productos:'/api/productos',
            razonSocial:'/api/razones-sociales',
            catgoriasBolsasTrabajo:'/api/categorias-bolsas',
            postulaciones:'/api/postulaciones',
            productosIMG:'/api/productos-imagenes',
            externosRedes:'/api/redes-empresas',


                         
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

         // para manejar el Fileupload o Carga de archivos
         this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true,
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));

        
        this.app.use( this.paths.buscar, require('../routes/buscar'));



        this.app.use( this.paths.noticias, require('../routes/noticias'));
        this.app.use( this.paths.talleres, require('../routes/talleres'));
        this.app.use( this.paths.convocatorias, require('../routes/convocatorias'));
        this.app.use( this.paths.carreras, require('../routes/carreras'));
        this.app.use( this.paths.escuelas, require('../routes/escuelas'));

        this.app.use( this.paths.ofertas, require('../routes/ofertas'));
        this.app.use( this.paths.inscripcines, require('../routes/inscripciones'))
        // this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));

        
        this.app.use( this.paths.externos, require('../routes/externos'));
        this.app.use( this.paths.personas, require('../routes/personas'));
        
        this.app.use( this.paths.foros, require('../routes/foros'));

        this.app.use( this.paths.becas, require('../routes/becas'));
        this.app.use( this.paths.apoyos, require('../routes/apoyos'));
        this.app.use( this.paths.bolsas, require('../routes/bolsas-trabajos'));
        
        // this.app.use( this.paths.uploads, require('../routes/uploads'));

        this.app.use( this.paths.uploads, require('../routes/uploads')); 

        this.app.use( this.paths.images, require('../routes/images')); 
        
        
        this.app.use( this.paths.convocatoriaIMG, require('../routes/convocatorias-imgs')); 
        this.app.use( this.paths.noticiaIMG, require('../routes/noticias-imgs')); 
        this.app.use( this.paths.tallerIMG, require('../routes/talleres-imgs')); 
        
        this.app.use( this.paths.participantes, require('../routes/participantes')); 
        this.app.use( this.paths.instructores, require('../routes/instructores'));

        this.app.use( this.paths.instructorTaller, require('../routes/instructores-talleres')); 
        this.app.use( this.paths.participantesNoticias, require('../routes/participantes-noticias')); 

        this.app.use( this.paths.redes, require('../routes/redes-sociales'));

        this.app.use( this.paths.redesInstructores, require('../routes/redesSociales-instructores')); 
        this.app.use( this.paths.redesParticipantes, require('../routes/redesSociales-Participantes')); 
        
        this.app.use( this.paths.usuariosForos, require('../routes/usuarios-foros')); 

        this.app.use( this.paths.webinars, require('../routes/webinars')); 


        this.app.use( this.paths.servicioSocial, require('../routes/servicio-social') );
        this.app.use( this.paths.practicasProfesionales, require('../routes/practicas-profesionales') )
        
        
        
        this.app.use( this.paths.catEstados, require('../routes/cat-estados') );
        this.app.use( this.paths.catGiros, require('../routes/cat-giros') );
        this.app.use( this.paths.catMunicipios, require('../routes/cat-municipios') );
        this.app.use( this.paths.catTipoNegocios, require('../routes/cat-tipoNegocios') );
        this.app.use( this.paths.titularesExternos, require('../routes/titulares-externos') );
        this.app.use( this.paths.aceptacionEmpresa, require('../routes/aceptacion-externo') );
        this.app.use( this.paths.catCategoriasProductos, require('../routes/cat-categorias-productos') );
        this.app.use( this.paths.productos, require('../routes/productos') );
        this.app.use( this.paths.razonSocial, require('../routes/cat-razon-social') );
        this.app.use( this.paths.catgoriasBolsasTrabajo, require('../routes/cat-categoria-bolsas') );
        this.app.use( this.paths.postulaciones, require('../routes/postulacion') );
        this.app.use( this.paths.productosIMG, require('../routes/cat-productos-img') );
        this.app.use( this.paths.externosRedes, require('../routes/cat-redes-externos') );



    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
