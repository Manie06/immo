const { response } = require("express");
const RepoRealty = require ('../repository/RealtyRepository.js')

module.exports = class Realty {
    print(request, response) {
      if(typeof request.session.user !== 'undefined') {
         response.render('admin/realty/list');
         return;
      }
       request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
       response.redirect('/connexion');  
    }

    printForm(request, response) {
        response.render('admin/realty/form', {form: { address : {} , contact : {}}});
    }

    processForm(request, response) {
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
      console.log(entity);

      let repo = new RepoRealty();
      repo.add(entity).then((realty) => {
        request.flash('notify', 'Votre bien à bien été créé.');
        response.redirect('/admin/realty');
    }, (err) => {
        //console.log(err);
        response.render('admin/realty/form', { 
            error : `L'enregistrement en base de données a échoué`, 
            form : entity 
        }); 
    }); 

    }
};
  