"use-strict";

const fs = require("fs");
const path = require("path");

const PRIMEIRO_COLOCADO = 1;
const QTD_VOLTAS_PARA_COMPLETAR_CORRIDA = 4;

class RelatorioService {

    /**
     * Este metodo retorna o calculo do tempo da volta de minutos para segundos
     * @param {String} tempoVolta 
     */
    static calculaTempoVoltaDeMinutosParaSegundos(tempoVolta) {

        const splitTempoVolta = tempoVolta.trim().split(":");
        const minuto = parseFloat(splitTempoVolta[0]);
        const segundos = parseFloat(splitTempoVolta[1]);
        const minutosParaSegundos = 60 * minuto;

        return (minutosParaSegundos + segundos).toFixed(3);
    }

    /**
     * Este metodo retorna todas as linhas do arquivo log.txt no diretorio  ./data
     */
    recuperaLinhas() {

        const caminhoArquivo = path.resolve(path.join(__dirname, "../../data/", "log.txt"));
        const bufferArquivo = fs.readFileSync(caminhoArquivo);

        let linhas = bufferArquivo.toString().split("\n");
        linhas = linhas.splice(1, linhas.length);

        return linhas;
    }

    /**
     * Este metodo retorna os dados estruturados que foram catalogados no arquivo log.txt
     */
    recuperaDados() {

        const linhas = this.recuperaLinhas();
        const dados = linhas.map(linha => {

            const elementosLinha = linha.trim().split(/\s*\s/);
            const splitPiloto = elementosLinha[1].split("–");

            return {
                idPiloto: parseInt(splitPiloto[0]),
                nomePiloto: splitPiloto[1],
                hora: elementosLinha[0],
                numeroVolta: parseInt(elementosLinha[2]),
                tempoVolta: elementosLinha[3],
                tempoVoltaSegundos: parseFloat(RelatorioService.calculaTempoVoltaDeMinutosParaSegundos(elementosLinha[3])),
                velocidadeMedia: parseFloat(elementosLinha[4].replace(",", ".")),
            };

        });

        return dados;
    }

    /**
     * Este metodo retorna uma lista com os codigos dos pilotos
     */
    recuperaListaIdPilotos() {

        const listaIdPilotos = [];
        const dados = this.recuperaDados();

        dados.forEach(item => {

            if (listaIdPilotos.indexOf(item.idPiloto) === -1) {
                listaIdPilotos.push(item.idPiloto);
            }
        });

        return listaIdPilotos;
    }

    /**
     * Este metodo retorna o resultado geral de cada piloto
     */
    recuperaResultadoGeral() {

        let resultadoGeral = [];
        let listaIdPilotos = this.recuperaListaIdPilotos();
        let dados = this.recuperaDados();

        listaIdPilotos.forEach(idPiloto => {

            const resultadosPiloto = dados.filter(item => item.idPiloto === idPiloto);

            let nomePiloto;
            let qtdVoltasCompletadas = 0;
            let tempoTotal = 0.000;
            let velocidadeMediaTotal = 0.000;
            let melhorVolta = this.recuperaMelhorVoltaDoPiloto(resultadosPiloto);
            let completouCorrida = "N";

            resultadosPiloto.forEach(resultado => {
                nomePiloto = resultado.nomePiloto;
                tempoTotal = parseFloat((tempoTotal + resultado.tempoVoltaSegundos).toFixed(3));
                velocidadeMediaTotal = velocidadeMediaTotal + resultado.velocidadeMedia;
                qtdVoltasCompletadas++;
                if (qtdVoltasCompletadas === QTD_VOLTAS_PARA_COMPLETAR_CORRIDA) {
                    completouCorrida = "S";
                }
            });

            if (completouCorrida == "S") {

                const velocidadMediaDuranteTodaCorrida = parseFloat((velocidadeMediaTotal / QTD_VOLTAS_PARA_COMPLETAR_CORRIDA).toFixed(3));

                resultadoGeral.push({
                    idPiloto,
                    nomePiloto,
                    qtdVoltasCompletadas,
                    tempoTotal,
                    velocidadMediaDuranteTodaCorrida,
                    melhorVolta,
                    completouCorrida
                });
            } else {
                resultadoGeral.push({
                    idPiloto,
                    nomePiloto,
                    qtdVoltasCompletadas,
                    tempoTotal,
                    melhorVolta,
                    completouCorrida
                });

            }

        });

        return resultadoGeral;

    }

    /**
     * Este metodo retorna o resultado geral de cada piloto por ordem de chegada
     */
    recuperaResultadoGeralPorOrdemChegada() {

        let resultadoGeral = this.recuperaResultadoGeral();

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

            if (resultado.completouCorrida === "S") {

                resultado.posicaoDeChegada = posicaoDeChegada;

                if (posicaoDeChegada !== PRIMEIRO_COLOCADO) {
                    let diferenca = resultado.tempoTotal - resultadoGeral[0].tempoTotal;
                    resultado.tempoAposPrimeiroColocado = parseFloat(diferenca.toFixed(3));
                }

            }


            return resultado;
        });

        return resultadoGeral;
    }

    /**
     * Este metodo retorna o relatorio final de toda a corrida.
     */
    recuperaRelatorioFinalDeTodaCorrida() {

        const dados = this.recuperaDados();

        const melhorVoltaCorrida = this.recuperaDadosMelhorVoltaDaCorrida(dados);
        const resultadoGeralPorOrdemChegada = this.recuperaResultadoGeralPorOrdemChegada();

        const relatorioFinal = {

            melhorVoltaCorrida,
            resultadoGeralPorOrdemChegada,
        };

        return relatorioFinal;
    }


    /**
     * Este metodo retorna a melhor volta do piloto
     * @param {ArrayObject} resultadosPiloto 
     */
    recuperaMelhorVoltaDoPiloto(resultadosPiloto) {

        if (resultadosPiloto.length === 0) throw new Error(`resultadosPiloto esta vazio`);

        const listaTempoVoltaSegundos = Array.from(resultadosPiloto, (v, k) => {
            return v.tempoVoltaSegundos;
        });

        let min = listaTempoVoltaSegundos.reduce((previous, current) => {
            return Math.min(previous, current);
        });

        return resultadosPiloto.filter(resultado => resultado.tempoVoltaSegundos === min)[0].numeroVolta;

    }

    /**
     * Este metodo retorna os dados da melhor volta da corrida
     * @param {ArrayObject} dados 
     */
    recuperaDadosMelhorVoltaDaCorrida(dados) {

        if (dados.length === 0) throw new Error(`dados esta vazio`);

        const listaTempoVoltaSegundos = Array.from(dados, (v, k) => {
            return v.tempoVoltaSegundos;
        });

        let min = listaTempoVoltaSegundos.reduce((previous, current) => {
            return Math.min(previous, current);
        });

        return dados.filter(linha => linha.tempoVoltaSegundos === min)[0];
    }

}

module.exports = new RelatorioService();