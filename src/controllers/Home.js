const RepoRealty = require ('../repository/RealtyRepository.js')
const UploadImageProductService = require ('../services/UploadImageProduct')

module.exports = class Home {
    print(req, res) {
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            const UploadImageProduct = new UploadImageProductService();
            realties = realties.map((realty) => {
                realty.pictures = UploadImageProduct.GetPhoto(realty.id);
                return realty;
            });
            res.render('home', {realties});
        });
    }



    printRealty(request, response) {
        if(typeof request.params.slug !== 'undefined' && request.params.slug != '') {
            let repo = new RepoRealty();
            repo.find({slug : request.params.slug}).then((realty) => {
                if(realty.length === 0) {
                    request.flash('error', 'Une erreur est survenue')
                    response.redirect('/');
                } else {
                    const UploadImageProduct = new UploadImageProductService();
                    realty[0].pictures = UploadImageProduct.GetPhoto(realty[0].id);
                    response.render('details', { realty : realty[0] });
                }
            }, () => {
                request.flash('error', 'Une erreur est survenue')
                response.redirect('/');
            });
        }
        
    }
    


};

