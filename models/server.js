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
            // buscar:     '/api/buscar',
            noticias: '/api/noticias',
            talleres: '/api/talleres',
            convocatorias: '/api/convocatorias',
            carreras: '/api/carreras',
            escuelas: '/api/escuelas',


            externos: '/api/externos',


            ofertas: '/api/ofertas',
            inscripcines: '/api/inscripciones',
            // productos:  '/api/productos',
            usuarios:   '/api/usuarios',

            uploads:    '/api/uploads',
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
        // this.app.use( this.paths.buscar, require('../routes/buscar'));
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
        
        // this.app.use( this.paths.uploads, require('../routes/uploads'));

        this.app.use( this.paths.uploads, require('../routes/uploads')); 
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
