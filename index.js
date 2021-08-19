const express = require("express");
const app = express();

const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados")
    }).catch((msgErro)=>{
        console.log(msgErro)
    })


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/",(req, res)=>{
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render("index",{ perguntas:perguntas});
    })
});

app.get("/perguntar",(req, res)=>{
    res.render("perguntar")
})

app.post("/salvarpergunta",(req, res)=>{
    let { titulo, descricao } = req.body;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req, res)=>{
    let {id} = req.params;
    Pergunta.findOne({
        where:{id:id}
    }).then((pergunta)=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: id},
                order: [['id', 'DESC']]
            }).then((respostas)=>{
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas:respostas
                });
            })
        }else{
            res.send("Pergunta não encontrada")
        }
    })
})

app.post("/responder",(req, res)=>{
    let { corpo, perguntaId } = req.body;
    Resposta.create({
        corpo: corpo, 
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    });
})

app.listen(8080, ()=>{
    console.log("App rodando")
})