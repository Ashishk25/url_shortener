const express = require('express');
const ShortUrl = require('./models/shortUrl');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

const dbUri= 'mongodb+srv://Ashish:Ashish123@cluster0.luvis.mongodb.net/UrlShortner?retryWrites=true&w=majority';

mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=>{       
        app.listen( process.env.PORT || 5000);
        console.log('DB connected \nServer is ready to listen');
    })
    .catch((err) => {
        console.log(err);
    });

// routes
app.get('/', (req, res) => {
    ShortUrl.find()
    .then((result)=>{
        res.render('index', { urls: result})
    })
    .catch((err) => {
        console.log(err);
    });
   ;
});
app.post('/shortUrl',(req , res) => {
        const shorturl = new ShortUrl({
            full: req.body.fullUrl,
        }); 
        shorturl.save()
        .then((result)=>{
            console.log("Url shrinked and saved");
            res.redirect('/');
          })
        .catch((err) => {
              console.log(err);
          });
        
});
app.get('/:shortUrl', (req, res) => {
    ShortUrl.findOne({ short: req.params.shortUrl })
    .then((result)=>{
        result.clicks++;
        result.save();
        res.redirect(result.full);
    })
    .catch((err) => {
        console.log(err);
    });
   ;
});