const mocha = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;

const RelatorioService = require("./service");

chai.use(sinonChai);

describe("RelatorioService", () => {

    const service = new RelatorioService();

    describe("~> recuperaLinhas()", () => {

        it("Deve retornar um array diferente de vazio", () => {

            const result = service.recuperaLinhas();

            expect(result).to.be.an("array").that.is.not.empty;

        });
    });

    describe("~> recuperaDados()", () => {

        it(`Deve retornar uma lista de objetos com as propriedades: 
        idPiloto,nomePiloto,hora,numeroVolta,tempoVolta,
        tempoVoltaSegundos,velocidadeMedia`, () => {

                const result = service.recuperaDados();

                expect(result[0]).to.be.a("object");
                expect(result[0]).to.have.property("idPiloto");
                expect(result[0]).to.have.property("nomePiloto");
                expect(result[0]).to.have.property("hora");
                expect(result[0]).to.have.property("numeroVolta");
                expect(result[0]).to.have.property("tempoVolta");
                expect(result[0]).to.have.property("tempoVoltaSegundos");
                expect(result[0]).to.have.property("velocidadeMedia");

            });
    });

    describe("~> recuperaListaIdPilotos()", () => {

        it("Deve retornar um array de numeros", () => {

            const result = service.recuperaListaIdPilotos();

            expect(result).to.be.an("array").that.is.not.empty;
            expect(result[0]).to.be.a("number");


        });
    });

    describe("~> recuperaResultadoGeral()", () => {

        it(`Deve retornar uma lista de objetos com as propriedades:
         idPiloto,nomePiloto,qtdVoltasCompletadas,tempoTotal,
         velocidadMediaDuranteTodaCorrida,melhorVolta,completouCorrida`, () => {

                const result = service.recuperaResultadoGeral();

                expect(result[0]).to.be.a("object");
                expect(result[0]).to.have.property("idPiloto");
                expect(result[0]).to.have.property("nomePiloto");
                expect(result[0]).to.have.property("qtdVoltasCompletadas");
                expect(result[0]).to.have.property("tempoTotal");
                expect(result[0]).to.have.property("velocidadMediaDuranteTodaCorrida");
                expect(result[0]).to.have.property("melhorVolta");
                expect(result[0]).to.have.property("completouCorrida");


            });
    });


    describe("~> recuperaResultadoGeralPorOrdemChegada()", () => {

        it(`Deve retornar uma lista de objetos com as propriedades:
         idPiloto,nomePiloto,qtdVoltasCompletadas,tempoTotal,
         velocidadMediaDuranteTodaCorrida,melhorVolta,completouCorrida,posicaoDeChegada`, () => {

                const result = service.recuperaResultadoGeralPorOrdemChegada();

                expect(result[0]).to.be.a("object");
                expect(result[0]).to.have.property("idPiloto");
                expect(result[0]).to.have.property("nomePiloto");
                expect(result[0]).to.have.property("qtdVoltasCompletadas");
                expect(result[0]).to.have.property("tempoTotal");
                expect(result[0]).to.have.property("velocidadMediaDuranteTodaCorrida");
                expect(result[0]).to.have.property("melhorVolta");
                expect(result[0]).to.have.property("completouCorrida");
                expect(result[0]).to.have.property("posicaoDeChegada");

            });
    });


    describe("~> recuperaRelatorioFinalDeTodaCorrida()", () => {

        it("Deve retornar um objeto com as propriedades: melhorVoltaCorrida, resultadoGeralPorOrdemChegada", () => {

            const result = service.recuperaRelatorioFinalDeTodaCorrida();

            expect(result).to.be.a("object");
            expect(result).to.have.property("melhorVoltaCorrida");
            expect(result).to.have.property("resultadoGeralPorOrdemChegada");

        });
    });

    describe("~> recuperaMelhorVoltaDoPiloto()", () => {

        it("Deve retornar o valor da numero da volta de menor tempo", () => {

            const resultadoPiloto = [
                {
                    tempoVoltaSegundos: 60.320,
                    numeroVolta: 1
                },
                {
                    tempoVoltaSegundos: 40.320,
                    numeroVolta: 2
                },
                {
                    tempoVoltaSegundos: 50.320,
                    numeroVolta: 3
                },
                {
                    tempoVoltaSegundos: 20.320,
                    numeroVolta: 4
                }
            ];

            const result = service.recuperaMelhorVoltaDoPiloto(resultadoPiloto);

            expect(result).to.be.equal(4);

        });


        it("Deve retornar uma exception quando parametro é vazio", () => {

            expect(service.recuperaMelhorVoltaDoPiloto).to.throw();

        });

    });


    describe("~> recuperaDadosMelhorVoltaDaCorrida()", () => {

        it("Deve retornar o valor da numero da volta de menor tempo", () => {

            const dados = [
                {
                    tempoVoltaSegundos: 60.320,
                    numeroVolta: 1,
                    idPiloto: 1
                },
                {
                    tempoVoltaSegundos: 40.320,
                    numeroVolta: 2,
                    idPiloto: 2

                },
                {
                    tempoVoltaSegundos: 50.320,
                    numeroVolta: 3,
                    idPiloto: 1

                },
                {
                    tempoVoltaSegundos: 20.320,
                    numeroVolta: 4,
                    idPiloto: 2

                }
            ];

            const result = service.recuperaDadosMelhorVoltaDaCorrida(dados);

            expect(result).to.be.a("object");
            expect(result).to.have.property("tempoVoltaSegundos", 20.320);
            expect(result).to.have.property("numeroVolta", 4);
            expect(result).to.have.property("idPiloto", 2);


        });


        it("Deve retornar uma exception quando parametro é vazio", () => {

            expect(service.recuperaDadosMelhorVoltaDaCorrida).to.throw();

        });

    });

    describe("~> calculaTempoVoltaDeMinutosParaSegundos()", () => {

        it("Deve retornar o tempo da volta em segundos", () => {

            const tempoVolta = "1:30.673";
            const result = RelatorioService.calculaTempoVoltaDeMinutosParaSegundos(tempoVolta);
            expect(result).to.be.equal("90.673");
        });
    });


});
