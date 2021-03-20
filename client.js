const PROTO_PATH = "./biblioteca.proto";

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// carregamento do arquivo proto e geração das definições
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).bib;

const client = new protoDescriptor.Biblioteca("127.0.0.1:50051", grpc.credentials.createInsecure());

client.CadastrarLivro({
    livro: {
        codigo: 456,
        nome: "Sistemas Operacionais Modernos",
        autor: "Andrew S. Tanenbaum",
        edicao: 4,
        ano: 2012,
    },
}, (err, response) => {
    if (err != null) {
        console.log(" >>> Ocorreu um cadastrando livro!");
        console.log(err);
        return;
    }

    console.log("Livro cadastrado com sucesso!");

    client.Consultar({}, (err, response) => {
        if (err != null) {
            console.log(" >>> Ocorreu um erro na consulta!");
            console.log(err);
            return;
        }
    
        const livros = response.livros;
    
        console.log("Lista de livros cadastrados:");
        console.log(livros);
    });
});


// client.PesquisarPorCodigo({ codigo: 123 }, (err, response) => {
//     // if (err != null) {
//     //     console.log(" >>> Ocorreu um erro na consulta!");
//     //     console.log(err);
//     //     console.log(" após o erro...");
//     //     return;
//     // }

//     const livro = response.livro;

//     if (livro == null) {
//         console.log("Livro não encontrado");
//     } else {
//         console.log("Livro encontrado na biblioteca:");
//         console.log(livro);
//     }
// });
