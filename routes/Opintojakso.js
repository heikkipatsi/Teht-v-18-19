var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display Opintojakso page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Opiskelija ORDER BY id DESC',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/Opintojakso/index.ejs
            res.render('Opintojakso',{data:''});   
        } else {
            // render to views/Opintojakso/index.ejs
            res.render('Opintojakso',{data:rows});
        }
    });
});

//display add Opintojakso page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('Opintojakso/add', {
        Etunimi: '',
        Sukunimi: '',
        Luokkatunnus: '',
        Osoite: ''
    })
})

// add a new Opintojakso
router.post('/add', function(req, res, next) {    

    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Luokkatunnus = req.body.Luokkatunnus;
    let Osoite = req.body.Osoite;
    let errors = false;

    if( Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Enter Etu-, Sukunimi, Luokkatunnus and Osoite");
        // render to add.ejs with flash message
        res.render('Opintojakso/add', {
             Etunimi: Etunimi,
            Sukunimi: Sukunimi,
            Luokkatunnus: Luokkatunnus,
            Osoite: Osoite
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
            Luokkatunnus: Luokkatunnus,
            Osoite: Osoite
        }
        
        // insert query
        dbConn.query('INSERT INTO Opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('Opintojakso/add', {
                     Etunimi: form_data. Etunimi,
                    Sukunimi: form_data.Sukunimi,
                    Luokkatunnus: form_data.Luokkatunnus,
                    Osoite: form_data.Osoite
                })
            } else {                
                req.flash('success', 'Opintojakso added');
                res.redirect('/Opintojakso');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/Opintojakso')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('Opintojakso/edit', {
                title: 'Edit Opintojakso', 
                id: rows[0].id,
                 Etunimi: rows[0]. Etunimi,
                Sukunimi: rows[0].Sukunimi,
                Luokkatunnus: rows[0].Luokkatunnus,
                Osoite: rows[0].Osoite
            })
        }
    })
})

// update Opintojakso data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
     let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Luokkatunnus = req.body.Luokkatunnus;
    let Osoite = req.body.Osoite;
    let errors = false;

    if (Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter  Etunimi, Sukunimi, Luokkatunnus and Osoite");
        // render to add.ejs with flash message
        res.render('Opintojakso/edit', {
            id: req.params.id,
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
            Luokkatunnus: Luokkatunnus,
            Osoite: Osoite
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
            Luokkatunnus: Luokkatunnus,
            Osoite: Osoite
        }
        // update query
        dbConn.query('UPDATE Opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('Opintojakso/edit', {
                    id: req.params.id,
                     Etunimi: form_data. Etunimi,
                    Sukunimi: form_data.Sukunimi,
                    Luokkatunnus: form_data.Luokkatunnus,
                    Osoite: form_data.Osoite
                })
            } else {
                req.flash('success', 'Opintojakso successfully updated');
                res.redirect('/Opintojakso');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to Opintojakso page
            res.redirect('/Opintojakso')
        } else {
            // set flash message
            req.flash('success', 'Opiskelija successfully deleted! ID = ' + id)
            // redirect to Opintojakso page
            res.redirect('/Opintojakso')
        }
    })
}) 

module.exports = router; 