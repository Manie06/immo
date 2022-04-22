const fs = require("fs");

module.exports = class UploadImageProduct {
    moveFile(file, id_product) {
        return new Promise((resolve, reject) => {
            const regex = /[^a-z0-9_\.]/i;
            let baseName = file.name.replace(regex,'_').replace('__','_').replace('..','_');
            let uploadPath = process.env.DIR_IMG_PRODUCT+id_product+'/'+baseName;
            file.mv(uploadPath, (err) => resolve(uploadPath));
        });
    }
    
    GetPhoto(id_product){
        let filenames = {};
        if(fs.existsSync(process.env.DIR_IMG_PRODUCT+id_product)) {
            filenames = fs.readdirSync(process.env.DIR_IMG_PRODUCT+id_product);
            filenames = filenames.map((filename) => {
                return '/images/realties/'+id_product+'/'+filename;
            });
        } 
        return filenames;
    
    }
  
    
}
