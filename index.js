const express = require('express');
var cors = require('cors');
const app = express();
const port = process.env.PORT || '3001';

const jquery = require('jquery');
const Nightmare = require('nightmare');
//const nightmare = Nightmare({ cookiesFile: "./cookie.txt", show: true});
let nightmare = Nightmare({show: false});
//let nightmare = Nightmare();
const chai = require('chai');
const expect = chai.expect;
let fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`API REST corriendo en http://localhost:${port}`);
});

app.get('/', (req, res) => {



    //res.send({message: 'Hola mundo'});
    //https://newyork.craigslist.org/search/cpg?is_paid=yes&postedToday=1

    nightmare.goto('https://newyork.craigslist.org/search/cpg?is_paid=yes&postedToday=1')
        .wait(2000)
        .evaluate(function(){
            let gigs = [];
            // create an array to hold all gigs gathered by following code
            $('.hdrlnk').each(function(){
                item = {};
                item["title"] = $(this).text();
                item["link"] = $(this).attr("href");
                gigs.push(item)
            });
            // create a gig object with title and link, then push to the 'gigs' array
            return gigs
            // pass the gigs array forward so it can be looped through later on
        })
        .end()
        .then(function(result){
            console.log("To: nelsonkhan@gmail.com");
            console.log("From: nelsonkhan@gmail.com");
            console.log("Subject: Today's Gigs");
            console.log("\n");
            // set headers for email
            for(gig in result) {
                console.log(result[gig].title);
                console.log(result[gig].link);
                console.log("\n")
            }

            res.send({message: 'adios mundo'});
            // print each gig to the console in a neat format
        })




});

app.get('/hola/:name_persona', (req, res) => {
    res.send({message: `Hola ${req.params.name_persona}`});
});

app.get('/scraping', (req, res) => {
    res.sendFile(__dirname+'/hola.html');
});

app.get('/scraping2', (req, res) => {
    console.log("Iniciando scraping");
    let results = [];

    nightmare.goto('https://duckduckgo.com')
        .type('#search_form_input_homepage', 'github nightmare')
        .click('#search_button_homepage')
        .wait('#r1-0')
        .evaluate(
            function(){
                let gigs = [];
                // create an array to hold all gigs gathered by following code
                $('a.result__a').each(function(){
                    item = {};
                    //item["title"] = $(this).text();
                    item["link"] = $(this).attr("href");
                    gigs.push(item);
                });
                // create a gig object with title and link, then push to the 'gigs' array
                return gigs
                // pass the gigs array forward so it can be looped through later on
            }
        )
        .end()
        .then((response) => {
            res.send({message: response})
        })
        .catch(error => {
            console.error('Search failed:', error)
        });

});


app.get('/scraping_rational', (req, res) => {
    console.log("Iniciando scraping Connected Cooking");

    new Nightmare({show: true})
        .goto('https://www.connectedcooking.com/#/login')
        .type('#username', 'tecnoandina@tecnoandina.cl')
        .type('#password', 'Kennedy5600')
        .click('button[type="submit"]')
        .wait('.nav.navbar-nav')
        .goto('https://www.connectedcooking.com/#/devices/dashboard?groupId=8009056')
        //.wait('#haccpProgramCount', '#haccpCount', '#haccpCareCount', '.bar-chart svg', '#rt-bar-chart-container-214 svg', '#rt-bar-chart-container-216 svg', '#rt-bar-chart-container-218 svg')
        .wait(4000)
        .inject('js', 'jquery.js')
        .evaluate(
            function(){

                let periodo = $('.header.grey').children('h3').html();

                let programas = {};
                programas['programas_de_coccion'] = $('#haccpProgramCount').children('span').html();
                programas['lotes_de_hacpp'] = $('#haccpCount').children('span').html();
                programas['programas_de_limpieza'] = $('#haccpCareCount').children('span').html();

                let gigs = [];
                $('div.bar-chart').each(function(){
                    let item = $(this).children('svg').get(0).outerHTML;
                    gigs.push(item);
                });

                let alternativas = $("#field_filterGroup").get(0).outerHTML;


                return {
                    response: {
                        'periodo': periodo,
                        'programas': programas,
                        'aplicacion': gigs,
                        'alternativas': alternativas
                    }
                };
            }
        )
        .end()
        .then((response) => {
            res.send({message: response});
            console.log('Scraping finalizado');
        })
        .catch(error => {
            console.error('Search failed:', error)
        });
});


app.get('/scraping_rational/:numero', (req, res) => {
    //res.send({message: `Hola ${req.params.name_persona}`});

    console.log("Iniciando scraping Connected Cooking");

    new Nightmare({show: false})
        .goto('https://www.connectedcooking.com/#/login')
        .type('#username', 'tecnoandina@tecnoandina.cl')
        .type('#password', 'Kennedy5600')
        .click('button[type="submit"]')
        .wait('.nav.navbar-nav')
        .goto('https://www.connectedcooking.com/#/devices/dashboard?groupId='+req.params.numero)
        //.wait('#haccpProgramCount', '#haccpCount', '#haccpCareCount', '.bar-chart svg', '#rt-bar-chart-container-214 svg', '#rt-bar-chart-container-216 svg', '#rt-bar-chart-container-218 svg')
        .wait(4000)
        .inject('js', 'jquery.js')
        .evaluate(
            function(){

                let periodo = $('.header.grey').children('h3').html();

                let programas = {};
                programas['programas_de_coccion'] = $('#haccpProgramCount').children('span').html();
                programas['lotes_de_hacpp'] = $('#haccpCount').children('span').html();
                programas['programas_de_limpieza'] = $('#haccpCareCount').children('span').html();

                let gigs = [];
                $('div.bar-chart').each(function(){
                    let item = $(this).children('svg').get(0).outerHTML;
                    gigs.push(item);
                });

                let alternativas = $("#field_filterGroup").get(0).outerHTML;


                return {
                    response: {
                        'periodo': periodo,
                        'programas': programas,
                        'aplicacion': gigs,
                        'alternativas': alternativas
                    }
                };
            }
        )
        .end()
        .then((response) => {
            res.send({message: response});
            console.log('Scraping finalizado');
        })
        .catch(error => {
            console.error('Search failed:', error)
        });

});


