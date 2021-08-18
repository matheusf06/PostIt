const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

const path = require ("path");

const sqlite = require ('sqlite');
const dbConnection = sqlite.open(path.resolve(__dirname, 'bd.sqlite'), { Promise });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const db = await dbConnection
    const notas = await db.all('select * from notas')
    res.render('home', {notas})
})

app.get('/nova_anotacao', (req, res) => {
    res.render('nova_anotacao')
})

app.post('/nova_anotacao', async (req, res) => {
    const { titulo, descricao, cor } = req.body
    const db = await dbConnection
    await db.run(`insert into notas(titulo, descricao, cor) values ('${titulo}', '${descricao}', '${cor}')`)
    res.redirect ('/')
});

app.get('/delete/:id', async(req, res) => {
    const db = await dbConnection
    const id = req.params.id
    await db.run(`delete from notas where id = ${id}`)
    res.redirect('/')
    
})

const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists notas (id INTEGER PRIMARY KEY, titulo TEXT, descricao TEXT, cor TEXT);')
};
init();

const port = process.env.PORT || 3000;

app.listen(port, err => {
    if(err){
        console.log("Deu erro")
    }else{
        console.log("Deu certo")
    }
})