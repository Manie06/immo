require('dotenv').config({ path: `.env.test` });
const assert = require('assert');
const RepoUser = require('../src/repository/User');

describe('Utilisateurs', () => {
    let repo, entity;
    before(() => {
        repo = new RepoUser();
        entity = {
            email : 'j.doe@yopmail.com',
            password : 'test', // devra être hashé
            civility : '1',
            firstname: 'John',
            lastname: 'Doe',
            phone: '0600000000'
        };
    });

    it(`Vérification email, d'un non existant`, (done) => {
        repo.emailExists(entity.email).then((result) => {
            assert.equal(result, false);
            done();
        });
    });
 
    it(`Création d'un compte`, (done) => {
        repo.emailExists(entity.email).then((result) => {
            if(true) {
                repo.add(entity).then((result) => {
                    assert.equal(result.email, entity.email);
                    assert.equal(result.civility, entity.civility);
                    assert.equal(result.firstname, entity.firstname);
                    assert.equal(result.lastname, entity.lastname);
                    assert.equal(result.phone, entity.phone);
                    done();
                }, () => { assert.ok(false); done(); });
            }
        });
    });

    it(`Vérification email, d'un existant`, (done) => {
        repo.emailExists(entity.email).then((result) => {
            assert.equal(result, true);
            done();
        });
    });

    it(`Suppression d'un untilisateur`, (done) => {
        // supprimer l'utilisateur
        repo.delete({ email: entity.email }).then(() => {
            assert.ok(true);
            done();
        }, () => { 
            assert.ok(false); 
            done(); 
        });
    });
});