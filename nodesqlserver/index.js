const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql');
const connStr = "Server=localhost;Database=ProjetoTesteWebApi;User Id=sa;Password=nononono;";


//fazendo a conexão global
sql.connect(connStr)
   .then(conn => global.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Rodando ...' }));
app.use('/', router);


//inicia o servidor
app.listen(port);
console.log('API rodando ... ');

function execSQLQuery(sqlQry, res){
    global.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

function RetornaDataHoraAtual(){
	var dNow = new Date();
	var localdate =  (dNow. getMonth()+1) + '/' +  dNow. getDate() + '/' + dNow. getFullYear() + ' ' + dNow. getHours() + ':' + dNow. getMinutes();

return localdate;
}


// GET :id? param opcional
router.get('/clientes/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery('select Id, Nome, Data_Nascimento DataNascimento, Email, Data_inclusao DataInclusao from clientes' + filter, res);
})


// POST
router.post('/clientes', (req, res) =>{
    const Nome = req.body.Nome.substring(0,50);
    const DataNascimento = req.body.DataNascimento;
    const Email = req.body.Email.substring(0,30);
    const DataInclusao = RetornaDataHoraAtual();
    execSQLQuery(`INSERT INTO Clientes(Nome, Data_Nascimento, Email, Data_Inclusao) VALUES('${Nome}','${DataNascimento}', '${Email}', '${DataInclusao}')`, res);
})


//PUT :id param obrigatório
router.put('/clientes/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const Nome = req.body.Nome.substring(0,50);
	const DataNascimento = req.body.DataNascimento;
    const Email = req.body.Email.substring(0,30);
    execSQLQuery(`UPDATE Clientes SET Nome='${Nome}', Data_Nascimento='${DataNascimento}', Email='${Email}' WHERE ID=${id}`, res);
})

// DELETE :id param obrigatório
router.delete('/clientes/:id', (req, res) =>{
    execSQLQuery('DELETE Clientes WHERE ID=' + parseInt(req.params.id), res);
})



