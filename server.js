const PROTO_PATH = "./biblioteca.proto";

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const bd = [
    {
        codigo: 123,
        nome: "Sistemas Distribuídos",
        autor: "Andrew S. Tanenbaum",
        edicao: 3,
        ano: 2007,
    },
];

// carregamento do arquivo proto e geração das definições
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).bib;

const server = new grpc.Server();

server.addService(protoDescriptor.Biblioteca.service, {
    Consultar: function(call, callback) {
        callback(null, { livros: bd });
    },
    PesquisarPorCodigo: function(call, callback) {
        const codigo = call.request.codigo;
        let resultado = null;

        for (i = 0; i < bd.length; i++) {
            if (bd[i].codigo === codigo) {
                resultado = bd[i];
                break;
            }
        }

        callback(null, { livro: resultado });
    },
    CadastrarLivro: function(call, callback) {
        const livro = call.request.livro;

        bd.push(livro);

        callback(null, {});
    }
});

server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());

console.log("Iniciando servidor gRPC...");

server.start();