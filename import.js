"use-strict";

//BIBLIOTECAS/////////////////////////////////////////

const fs = require("fs");
const path = require("path");

//CONSTANTES///////////////////////////////////////////

const QTD_VOLTAS_PARA_COMPLETAR_CORRIDA = 4;

//FUNCOES/////////////////////////////////////////////

function calculaTempoVoltaDeMinutosParaSegundos(tempoVolta) {

    const splitTempoVolta = tempoVolta.trim().split(":");
    const minuto = parseFloat(splitTempoVolta[0]);
    const segundos = parseFloat(splitTempoVolta[1]);
    const minutosParaSegundos = 60 * minuto;

    return (minutosParaSegundos + segundos).toFixed(3);
}

function recuperaMelhorVoltaDoPiloto(resultadosPiloto) {

    if (resultadosPiloto.length === 0) throw new Error(`resultadosPiloto esta vazio`);

    const listaTempoVoltaSegundos = Array.from(resultadosPiloto, (v, k) => {
        return v.tempoVoltaSegundos;
    });

    let min = listaTempoVoltaSegundos.reduce((previous, current) => {
        return Math.min(previous, current);
    });

    return resultadosPiloto.filter(resultado => resultado.tempoVoltaSegundos === min)[0].numeroVolta;

}

function recuperaDadosMelhorVoltaDaCorrida(dados) {

    if (dados.length === 0) throw new Error(`dados esta vazio`);

    const listaTempoVoltaSegundos = Array.from(dados, (v, k) => {
        return v.tempoVoltaSegundos;
    });

    let min = listaTempoVoltaSegundos.reduce((previous, current) => {
        return Math.min(previous, current);
    });

    return dados.filter(linha => linha.tempoVoltaSegundos === min)[0];
}

//PROCEDIMENTO 1 ///////////////////////////////////////
/**
 * Este procedimento sera responsavel de transformar os dados do log.txt 
 * para uma estrutura de dados capaz de ser manipulada.
 */

const diretorio = path.join(__dirname, "/data/");
const nomeArquivo = "log.txt";
const arquivo = diretorio.concat(nomeArquivo);
const bufferArquivo = fs.readFileSync(arquivo);

let linhas = bufferArquivo.toString().split("\n");
linhas = linhas.splice(1, linhas.length);

const dados = linhas.map(linha => {

    const elementosLinha = linha.trim().split(/\s*\s/);
    const splitPiloto = elementosLinha[1].split("–");

    return {
        idPiloto: parseInt(splitPiloto[0]),
        nomePiloto: splitPiloto[1],
        hora: elementosLinha[0],
        numeroVolta: parseInt(elementosLinha[2]),
        tempoVolta: elementosLinha[3],
        tempoVoltaSegundos: parseFloat(calculaTempoVoltaDeMinutosParaSegundos(elementosLinha[3])),
        velocidadeMedia: parseFloat(elementosLinha[4].replace(",", ".")),
    };

});

//PROCEDIMENTO 2 //////////////////////////////////////////////
/**
 * Este procedimento sera responsavel de criar uma lista com id de todos os pilotos.
 */

const listaIdPilotos = [];

dados.forEach(item => {

    if (listaIdPilotos.indexOf(item.idPiloto) === -1) {
        listaIdPilotos.push(item.idPiloto);
    }
});

//PROCEDIMENTO 3 //////////////////////////////////////////

/**
 * Este procedimento sera responsavel de listar todos os pilotos que completaram a corrida
 * na ordem crescente de tempo gasto para completar a corrida.
 */
let resultadoGeral = [];

listaIdPilotos.forEach(idPiloto => {

    const resultadosPiloto = dados.filter(item => item.idPiloto === idPiloto);

    let completouCorrida = false;
    let tempoTotal = 0.000;
    let velocidadeMediaTotal = 0.000;
    let nomePiloto;
    let melhorVolta = recuperaMelhorVoltaDoPiloto(resultadosPiloto);
    let qtdVoltasCompletadas;

    resultadosPiloto.forEach(resultado => {
        if (resultado.numeroVolta === QTD_VOLTAS_PARA_COMPLETAR_CORRIDA) {
            completouCorrida = true;
        }
        nomePiloto = resultado.nomePiloto;
        tempoTotal = tempoTotal + resultado.tempoVoltaSegundos;
        velocidadeMediaTotal = velocidadeMediaTotal + resultado.velocidadeMedia;
        qtdVoltasCompletadas = resultado.numeroVolta;
    });


    const mediaVelocidade = (velocidadeMediaTotal / QTD_VOLTAS_PARA_COMPLETAR_CORRIDA).toFixed(3);

    resultadoGeral.push({
        idPiloto,
        nomePiloto,
        qtdVoltasCompletadas,
        tempoTotal,
        mediaVelocidade,
        melhorVolta,
    });

});

resultadoGeral.sort((a, b) => {
    if (a.tempoTotal > b.tempoTotal) {
        return 1;
    }
    if (a.tempoTotal < b.tempoTotal) {
        return -1;
    }
    return 0;
});


let posicaoDeChegada = 0;

resultadoGeral = resultadoGeral.map(resultado => {

    posicaoDeChegada++;

    let diferenca = resultado.tempoTotal - resultadoGeral[0].tempoTotal;

    resultado.tempoAposPrimeiro = diferenca.toFixed(3);
    resultado.posicaoDeChegada = posicaoDeChegada;

    return resultado;
});

//PROCEDIMENTO 4 //////////////////////////////////////////

/**
 * Este procedimento sera responsavel de recuperar os dados da melhor volta de toda a corrida.
 */
const dadosMelhorVoltaDaCorrida = recuperaDadosMelhorVoltaDaCorrida(dados);

//PROCEDIMENTO 5 ////////////////////////////////////////

const relatorioFinal = {

    dadosMelhorVoltaDaCorrida,
    resultadoDaCorrida: resultadoGeral
};

console.log(relatorioFinal);

