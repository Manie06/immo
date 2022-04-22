
module.exports = (app) => {

    //Accueil
    app.get('/', (req, res) => {
        let Home = require('../src/controllers/Home.js');
        (new Home()).print(req, res);
    });

    // Détails des biens 
    app.get('/realty/:slug', (req, res) => {
        let Home = require('../src/controllers/Home.js');
        (new Home()).printRealty(req, res);
    });

    // Incription GET
    app.get('/inscription', (req, res) => {
        let Register = require('../src/controllers/Register.js');
        (new Register()).print(req, res);
    });

    // Inscription POST
    app.post('/inscription', (req, res) => {
        let Register = require('../src/controllers/Register.js');
        (new Register()).process(req, res);
    });

    // Connexion GET
    app.get('/connexion', (req, res) => {
        let Authenticated = require('../src/controllers/Authenticated.js');
        (new Authenticated()).print(req, res);
      });

    // Connexion POST
    app.post('/connexion', (req, res) => {
        let Authenticated = require('../src/controllers/Authenticated.js');
        (new Authenticated()).process(req, res);
      });

    // Deconnexion
    app.get('/deconnexion', (req, res) => {
        let Authenticated = require('../src/controllers/Authenticated.js');
        (new Authenticated()).disconnect(req, res);
      })

      app.get('/admin', (req, res) => {
        let Dashboard = require('../src/controllers/Dashboard.js');
        (new Dashboard()).print(req, res);
    })
    app.get('/admin/realty', (req, res) => {
        let Realty = require('../src/controllers/Realty.js');
        (new Realty()).print(req, res);
    });
 
    app.get('/admin/realty/add', (req, res) => {
        let Realty = require('../src/controllers/Realty.js');
        (new Realty()).printForm(req, res);
    });

    app.post('/admin/realty/add', 
        require('express-fileupload')({createParentPath: true}),
        require('../src/services/LcParserService.js'), 
        (req, res) => {
            let Realty = require('../src/controllers/Realty.js');
            (new Realty()).processForm(req, res);
    });

    
    app.get('/admin/realty/delete/:id', (req, res) => {
        let Realty = require('../src/controllers/Realty.js');
        (new Realty()).delete(req, res);
    });

    app.get('/admin/realty/edit/:id', (req, res) => {
        let Realty = require('../src/controllers/Realty.js');
        (new Realty()).printForm(req, res);
    });

    app.post('/admin/realty/edit/:id', 
        require('express-fileupload')({createParentPath: true}),
        require('../src/services/LcParserService.js'), 
        (req, res) => {
            let Realty = require('../src/controllers/Realty.js');
            (new Realty()).processForm(req, res);
    });

    // Vérifier l'accès à l'admin avec le JWT
    app.use('/admin', (req, res, next) => { 
        const jwt = require('jsonwebtoken');
        const Cookies = require( "cookies" );
        const secretJwt = 'eyJeiwidHlwIjoiSyJhbGciOiJub25lIldUIn0Jub2wIjoiSldUIn0';

        // Récupération du token dans le cookie
        let token = new Cookies(req,res).get('access_token');
        // Si le cookie (access_token) n'existe pas
        if (token == null) return res.sendStatus(401);
     
        // sinon on vérifie le jwt
        jwt.verify(token, secretJwt, (err, dataJwt) => { 
            // Erreur du JWT (n'est pas un JWT, a été modifié, est expiré)
            if(err) return res.sendStatus(403);
            
            // A partir de là le JWT est valide on a plus qu'à vérifier les droits
            // Si on est admin
            if(typeof dataJwt.roles != 'undefined' && dataJwt.roles[0] == 'admin') {
                req.session.user = dataJwt.user;
                next();
            } 
            else {
                // si on n'est pas admin
                req.flash('error' , " Vous n\'avez pas les droits!")
                res.redirect('/');
                
            }
        });
    });
     
    
};
