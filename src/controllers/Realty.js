const { response } = require("express");
const RepoRealty = require ('../repository/RealtyRepository.js')
const UploadImageProductService = require('../services/UploadImageProduct.js');

module.exports = class Realty {
    // Liste des biens
    print(request, response) {
      if(typeof request.session.user !== 'undefined') {
          let repo = new RepoRealty();
          repo.find().then((realties) => {
              response.render('admin/realty/list', {realties});
          });
      } else {
          request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
          response.redirect('/connexion');  
      }
  }


  printForm(request, response) {
    if(typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
        request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
        response.redirect('/connexion');  
        return;
    }
    // on est en modification
    if(typeof request.params.id !== 'undefined') {
        let repo = new RepoRealty();
        repo.findById(request.params.id).then((realty) => {
            response.render('admin/realty/form', {form : realty});
        }, () => {
            request.flash('error',`Le bien n'a pas été trouvé`)
            response.redirect('/admin/realty');
        });   
    } 
    // on est en ajout
    else {
        response.render('admin/realty/form', {form: { contact: {}, address : {}}});
      }
    }


    processForm(request, response) {
        if(typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');  
            return;
        }
        //console.log(request.body)
        //console.log("ok")
        let entity = {
            seller : request.body.realty.seller || '',
            address : request.body.address || {},
            contact : request.body.contact || {},
            type : request.body.realty.type || '',
            price : request.body.realty.price || '',
            amount_commission : request.body.realty.amount_commission || '',
            percentage_commission : request.body.realty.percentage_commission || '',
            area : request.body.realty.area || '',
            room : request.body.realty.room || '',
            type_product : request.body.realty.type_product || '',
            info_realtyl : request.body.realty.info_realty || '',
        };
        //console.log(entity);

        const repo = new RepoRealty();
        let save;
        if(typeof request.params.id != 'undefined'  && request.params.id != '') {
            save = repo.update(request.params.id, entity);
        }
        else {
            save = repo.add(entity);
        }
        
        save.then((realty) => {
            if(typeof request.params.id != 'undefined'  && request.params.id != '') {
                request.flash('notify', 'Le bien a été modifié.');
            } else {
                request.flash('notify', 'Le bien a été créé.');
            }

              // Gestions d'upload des photos ici
            let photos = [];
            // Enregistrement des images
            if(typeof request.files != 'undefined' && request.files != null) {
                if(typeof request.files.photos[0] === 'undefined') {
                    request.files.photos = [request.files.photos];
                }

            const UploadImageProduct = new UploadImageProductService();
            if(typeof request.files.photos != 'undefined' && request.files.photos.length > 0) {
                Object.values(request.files.photos).forEach(file => {
                    photos.push(UploadImageProduct.moveFile(file, realty._id));
                    });
                }                                
            }
                Promise.all(photos).then((values) => {
                    response.redirect('/admin/realty');
            });
             }, (err) => {
                    response.render('admin/realty/form', { 
                     error : `L'enregistrement en base de données a échoué`, 
                    form : entity 
            }); 
        });
    }

    delete(request, response) {
      if(typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
          request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
          response.redirect('/connexion');  
          return;
      }

      if(typeof request.params.id != 'undefined'&& request.params.id != '') {
          let repo = new RepoRealty();
          repo.delete({_id : request.params.id}).then(() => {
              request.flash('notify', 'Le bien a été supprimé.');
              response.redirect('/admin/realty');
          }, () => {
              request.flash('error', 'La suppression du bien a échoué.');
              response.redirect('/admin/realty');
          });  
      } 
      else {
          request.flash('error', 'Une erreur est survenue.');
          response.redirect('/admin/realty');
      }
    }
    


};
  