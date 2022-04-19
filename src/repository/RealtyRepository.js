require('../../app/database.js');

const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const RealtySchema = mongoose.Schema({
    seller : { type: String },
    address : { 
        address1 :  { type: String },
        address2 :  { type: String },
        zipcode:  { type: String },
        city:  { type: String },
        info_address:  { type: String },
    },
    contact : { 
        civility: { type: String },
        lastname: { type: String },
        firstname: { type: String },
        email: { type: String },
        mobile: { type: String },
        phone: { type: String },
        info: { type: String },
    },
    type : { type: String },
    price : { type: String },
    amount_commission : { type: String },
    percentage_commission : { type: String },
    area : { type: String },
    room : { type: String },
    type_product : { type: String },
    info_realty : { type: String },
    slug: { type: String, slug: ['address.zipcode','address.city'], unique:true }
    

}, { versionKey: false });
 
module.exports = class Realty {
    constructor() {
        this.db = mongoose.model('Realty', RealtySchema); 
    }

    add(realtyEntity) {
        return new Promise((resolve, reject) => {
            this.db.create(realtyEntity, function (err, realty) {
                if (err) reject(err);
                resolve(realty);
            });
        });

    }
    find(search = {}) {
        return new Promise((resolve, reject) => {
            this.db.find(search, function (err, realty) {
                if (err) reject(err);
                resolve(realty);
            });
        });
    }
    delete(filter = {}) {
        return new Promise((resolve, reject) => {
            this.db.deleteOne(filter, function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            this.db.findById(id, function (err, realty) {
                if (err || realty === null) reject();
                resolve(realty);
            });
        });
    }
    /*update(id) {
        return new Promise((resolve, reject) => {
            this.db.findById(id, function (err, realty) {
                if (err || realty === null) reject();
                resolve(realty);
            });
        });
    }*/




}