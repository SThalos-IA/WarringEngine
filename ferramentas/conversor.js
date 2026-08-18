//==================================================
// WARRING CONVERTER
// PARTE 1 — CONFIGURAÇÃO
//==================================================

const CONFIG = {

    //--------------------------------------------------
    // PROJETO
    //--------------------------------------------------

    nomeJogo: "Warring",

    versao: "1.0",

    //--------------------------------------------------
    // TEXTO
    //--------------------------------------------------

    caracteresLinha: 42,

    maxLinhas: 3,

    //--------------------------------------------------
    // ARQUIVOS
    //--------------------------------------------------

    extensaoEntrada: ".txt",

    extensaoSaida: ".json",

    encoding: "UTF-8",

    //--------------------------------------------------
    // PASTAS
    //--------------------------------------------------

    pastaImagens: "personagens/",

    pastaTransicoes: "transicoes/",

    //--------------------------------------------------
    // INTERFACE
    //--------------------------------------------------

    limparConsoleAoConverter: true,

    mostrarMensagensConsole: true

};

//==================================================
// WARRING CONVERTER
// PARTE 2 — NORMALIZADOR DE TEXTO
//==================================================

class NormalizadorTexto {

    constructor() {

    }

    //--------------------------------------------------
    // NORMALIZAR
    //--------------------------------------------------

    normalizar(texto) {

        texto = this.normalizarQuebras(texto);

        texto = this.removerCaracteresInvisiveis(texto);

        texto = this.normalizarEspacos(texto);

        texto = this.normalizarReticencias(texto);

        return texto.trim();

    }

    //--------------------------------------------------
    // NORMALIZAR QUEBRAS DE LINHA
    //--------------------------------------------------

    normalizarQuebras(texto) {

        return texto

            .replace(/\r\n/g, "\n")

            .replace(/\r/g, "\n");

    }

    //--------------------------------------------------
    // REMOVER CARACTERES INVISÍVEIS
    //--------------------------------------------------

    removerCaracteresInvisiveis(texto) {

        return texto

            .replace(/\uFEFF/g, "")

            .replace(/\u200B/g, "")

            .replace(/\u200C/g, "")

            .replace(/\u200D/g, "")

            .replace(/\u00A0/g, " ");

    }

    //--------------------------------------------------
    // NORMALIZAR ESPAÇOS
    //--------------------------------------------------

    normalizarEspacos(texto) {

        return texto

            .replace(/[ \t]+/g, " ")

            .replace(/ +([,.;!?])/g, "$1")

            .replace(/\n[ \t]+/g, "\n")

            .replace(/\n{3,}/g, "\n\n");

    }

    //--------------------------------------------------
    // NORMALIZAR RETICÊNCIAS
    //--------------------------------------------------

    normalizarReticencias(texto) {

        return texto

            .replace(/\.{4,}/g, "...");

    }

}

//==================================================
// WARRING CONVERTER
// PARTE 3 — COMPOSITOR DE CAIXAS
//==================================================

class CompositorCaixa {

    constructor() {

        this.caracteresLinha =

            CONFIG.caracteresLinha;

        this.maxLinhas =

            CONFIG.maxLinhas;

        this.maxCaracteres =

            this.caracteresLinha *

            this.maxLinhas;

    }

    //--------------------------------------------------
    // DIVIDIR TEXTO
    //--------------------------------------------------

    dividir(texto) {

        if (!texto) {

            return [];

        }

        texto = texto

            .replace(/\s+/g, " ")

            .trim();

        if (texto === "") {

            return [];

        }

        //------------------------------------------
        // Se o texto cabe em uma caixa
        //------------------------------------------

        if (

            texto.length <=

            this.maxCaracteres

        ) {

            return [texto];

        }

        //------------------------------------------
        // Separar palavras
        //------------------------------------------

        const palavras =

            texto.split(" ");

        const caixas = [];

        let caixaAtual = "";

        //------------------------------------------
        // Montar caixas
        //------------------------------------------

        for (

            const palavra of palavras

        ) {

            const tentativa =

                caixaAtual === ""

                    ? palavra

                    : caixaAtual +

                      " " +

                      palavra;

            //--------------------------------------
            // Ainda cabe na caixa
            //--------------------------------------

            if (

                tentativa.length <=

                this.maxCaracteres

            ) {

                caixaAtual =

                    tentativa;

                continue;

            }

            //--------------------------------------
            // Salvar caixa atual
            //--------------------------------------

            if (

                caixaAtual !== ""

            ) {

                caixas.push(

                    caixaAtual

                );

            }

            //--------------------------------------
            // Começar nova caixa
            //--------------------------------------

            caixaAtual =

                palavra;

        }

        //------------------------------------------
        // Salvar última caixa
        //------------------------------------------

        if (

            caixaAtual !== ""

        ) {

            caixas.push(

                caixaAtual

            );

        }

        return caixas;

    }

}

//==================================================
// WARRING CONVERTER
// PARTE 4 — PERSONAGENS E IMAGENS
//==================================================

const PERSONAGENS = {

    //--------------------------------------------------
    // PERSONAGENS
    //--------------------------------------------------

    "KYUK": {

        imagem: "KYUK.png"

    },

    "YUKIA": {

        imagem: "YUKIA.png"

    },

    "BARK": {

        imagem: "BARK.png"

    },

    "GYUDER": {

        imagem: "GYUDER.png"

    },

    "LYCIA": {

        imagem: "LYCIA.png"

    },

    "LOKNAR": {

        imagem: "LOKNAR.png"

    },

    "NORIO": {

        imagem: "NORIO.png"

    },

    "SIAN": {

        imagem: "SIAN.png"

    },

    //--------------------------------------------------
    // ELIPHAS / MAGO MESTRE
    //--------------------------------------------------

    "ELIPHAS": {

        imagem: "ELIPHAS.png"

    },

    "MAGO MESTRE": {

        imagem: "ELIPHAS.png"

    },

    //--------------------------------------------------
    // NYARI
    //--------------------------------------------------

    "NYARI": {

        imagem: "NYARI.png",

        imagemApartirCapitulo: {

            14: "NYARI II.png"

        }

    },

    //--------------------------------------------------
    // ELISA
    //--------------------------------------------------

    "ELISA": {

        imagem: "ELISA.png",

        imagemApartirCapitulo: {

            14: "ELISA II.png"

        }

    }

};


//==================================================
// RESOLVER IMAGEM DO PERSONAGEM
//==================================================

function resolverImagemPersonagem(

    nome,

    capitulo

) {

    if (!nome) {

        return "";

    }

    //------------------------------------------
    // Normalizar nome
    //------------------------------------------

    const nomeNormalizado =

        nome

            .normalize("NFD")

            .replace(

                /[\u0300-\u036f]/g,

                ""

            )

            .trim()

            .toUpperCase();

    //------------------------------------------
    // Narrador nunca possui imagem
    //------------------------------------------

    if (

        nomeNormalizado ===

        "NARRADOR"

    ) {

        return "";

    }

    //------------------------------------------
    // Procurar personagem
    //------------------------------------------

    const personagem =

        PERSONAGENS[

            nomeNormalizado

        ];

    //------------------------------------------
    // Personagem não cadastrado
    //------------------------------------------

    if (!personagem) {

        console.warn(

            "Personagem sem imagem cadastrada:",

            nome

        );

        return "";

    }

    //------------------------------------------
    // Converter capítulo
    //------------------------------------------

    const numeroCapitulo =

        parseInt(

            String(capitulo)

                .replace(

                    /[^0-9]/g,

                    ""

                ),

            10

        ) || 0;

    //------------------------------------------
    // Verificar imagem específica
    // a partir de determinado capítulo
    //------------------------------------------

    if (

        personagem.imagemApartirCapitulo

    ) {

        const capitulos =

            Object.keys(

                personagem

                    .imagemApartirCapitulo

            )

                .map(

                    numero =>

                        parseInt(

                            numero,

                            10

                        )

                )

                .sort(

                    (a, b) =>

                        b - a

                );

        for (

            const inicio of capitulos

        ) {

            if (

                numeroCapitulo >=

                inicio

            ) {

                return (

                    CONFIG.pastaImagens +

                    personagem

                        .imagemApartirCapitulo

                        [inicio]

                );

            }

        }

    }

    //------------------------------------------
    // Imagem padrão
    //------------------------------------------

    return (

        CONFIG.pastaImagens +

        personagem.imagem

    );

}

//==================================================
// WARRING CONVERTER
// PARTE 5 — PARSER
//==================================================

class Parser {

    constructor(conversor) {

        this.conv = conversor;

        this.compositor =

            new CompositorCaixa();

        this.reset();

    }

    //--------------------------------------------------
    // RESET
    //--------------------------------------------------

    reset() {

        this.story = [];

    }

    //--------------------------------------------------
    // INTERPRETAR TEXTO
    //--------------------------------------------------

    interpretar(

        texto,

        capitulo

    ) {

        this.reset();

        //------------------------------------------
        // Normalizar quebras de linha
        //------------------------------------------

        texto = texto

            .replace(/\r\n/g, "\n")

            .replace(/\r/g, "\n");

        //------------------------------------------
        // Separar linhas
        //------------------------------------------

        const linhas = texto

            .split("\n")

            .map(

                linha => linha.trim()

            );

                //------------------------------------------
        // PROCESSAR LINHAS
        //------------------------------------------

        let i = 0;

//------------------------------------------
// IGNORAR TÍTULO GERAL DO JOGO
//------------------------------------------

if (

    linhas[i] &&

    linhas[i].trim().toLowerCase() === "warring"

) {

    i++;

}

//------------------------------------------
// IGNORAR LINHAS VAZIAS
//------------------------------------------

while (

    i < linhas.length &&

    linhas[i] === ""

) {

    i++;

}

//------------------------------------------
// TÍTULO DO CAPÍTULO
//------------------------------------------

if (

    i < linhas.length &&

    this.ehTituloCapitulo(

        linhas[i]

    )

) {

    const tituloCapitulo =

        linhas[i];

    console.log(

        "CRIANDO CHAPTER_TITLE:",

        tituloCapitulo

    );

    this.adicionarTituloCapitulo(

        tituloCapitulo,

        capitulo

    );

    i++;

}

//------------------------------------------
// IGNORAR LINHAS VAZIAS APÓS O TÍTULO
//------------------------------------------

while (

    i < linhas.length &&

    linhas[i] === ""

) {

    i++;

}

//------------------------------------------
// PROCESSAMENTO PRINCIPAL
//------------------------------------------

while (

    i < linhas.length

) {

    const linha = linhas[i];

    //--------------------------------------
    // Ignorar linhas vazias
    //--------------------------------------

    if (

        linha === ""

    ) {

        i++;

        continue;

    }

    //--------------------------------------
    // TRANSIÇÃO
    //--------------------------------------

    if (

        this.ehTransicao(

            linha

        )

    ) {

        this.adicionarTransicao();

        i++;

        continue;

    }

    //--------------------------------------
    // VERIFICAR FALA
    //--------------------------------------

    const fala =

        this.identificarFala(

            linha

        );

    //--------------------------------------
    // FALA DE PERSONAGEM
    //--------------------------------------

    if (fala) {

        const speaker =

            fala.speaker;

        const partes = [];

        if (

            fala.texto !== ""

        ) {

            partes.push(

                fala.texto

            );

        }

        i++;

        while (

            i < linhas.length

        ) {

            const proximaLinha =

                linhas[i];

            if (

                proximaLinha === ""

            ) {

                i++;

                break;

            }

            if (

                this.identificarFala(

                    proximaLinha

                )

            ) {

                break;

            }

            if (

                this.ehTransicao(

                    proximaLinha

                )

            ) {

                break;

            }

            if (

                this.ehTituloCapitulo(

                    proximaLinha

                )

            ) {

                break;

            }

            if (

                this.pareceNarracao(

                    proximaLinha

                )

            ) {

                break;

            }

            partes.push(

                proximaLinha

            );

            i++;

        }

        this.adicionarDialogo(

            speaker,

            partes,

            capitulo

        );

        continue;

    }

    //--------------------------------------
    // NARRAÇÃO
    //--------------------------------------

    const partesNarracao = [

        linha

    ];

    i++;

    while (

        i < linhas.length

    ) {

        const proximaLinha =

            linhas[i];

        if (

            proximaLinha === ""

        ) {

            i++;

            break;

        }

        if (

            this.identificarFala(

                proximaLinha

            )

        ) {

            break;

        }

        if (

            this.ehTransicao(

                proximaLinha

            )

        ) {

            break;

        }

        if (

            this.ehTituloCapitulo(

                proximaLinha

            )

        ) {

            break;

        }

        partesNarracao.push(

            proximaLinha

        );

        i++;

    }

    this.adicionarNarracao(

        partesNarracao

    );

}

return this.story;

    }

//--------------------------------------------------
// IDENTIFICAR TÍTULO DE CAPÍTULO
//--------------------------------------------------

ehTituloCapitulo(linha) {

    if (!linha) {

        return false;

    }

    const texto =

        linha

            .trim()

            .toLowerCase();

    return /^cap[ií]tulo\s+\d+\b/.test(

        texto

    );

}


//--------------------------------------------------
// ADICIONAR TÍTULO DE CAPÍTULO
//--------------------------------------------------

adicionarTituloCapitulo(

    titulo,

    capitulo

) {

    const numero =

        parseInt(

            String(capitulo)

                .replace(

                    /[^0-9]/g,

                    ""

                ),

            10

        ) || 0;

    //------------------------------------------
    // Tabela de imagens dos títulos
    //------------------------------------------

    const imagensTitulos = {

        1: "Assets/cap01 titulo.png",

        2: "Assets/cap02-03 titulo.png",

        3: "Assets/cap02-03 titulo.png",

        4: "Assets/cap04-09 titulo.png",

        5: "Assets/cap04-09 titulo.png",

        6: "Assets/cap04-09 titulo.png",

        7: "Assets/cap04-09 titulo.png",

        8: "Assets/cap04-09 titulo.png",

        9: "Assets/cap04-09 titulo.png",

        10: "Assets/cap10 titulo.png",

        11: "Assets/cap11-12 titulo.png",

        12: "Assets/cap11-12 titulo.png",

        13: "Assets/cap13 titulo.png",

        14: "Assets/WARRING MAPA.png",

        15: "Assets/WARRING MAPA.png",

        16: "Assets/WARRING MAPA.png",

        17: "Assets/WARRING MAPA.png",

        18: "Assets/WARRING MAPA.png",

        19: "Assets/WARRING MAPA.png"

    };

    //------------------------------------------
    // Imagem do título
    //------------------------------------------

    const imagem =

        imagensTitulos[numero]

            ? imagensTitulos[numero]

            : "";

    //------------------------------------------
    // DEBUG
    //------------------------------------------

    console.log(

        "ADICIONANDO TÍTULO:",

        titulo

    );

    console.log(

        "NÚMERO DO CAPÍTULO:",

        numero

    );

    console.log(

        "IMAGEM DO TÍTULO:",

        imagem

    );

    //------------------------------------------
    // Adicionar cena
    //------------------------------------------

    const cenaTitulo = {

        type: "chapter_title",

        title: titulo.trim(),

        image: imagem,

        text: ""

    };

    console.log(

        "CENA CHAPTER_TITLE CRIADA:",

        cenaTitulo

    );

    this.story.push(

        cenaTitulo

    );

}

    //--------------------------------------------------
    // IDENTIFICAR FALA
    //--------------------------------------------------

    identificarFala(linha) {

        const resultado =

            linha.match(

                /^\s*([^:]{1,60})\s*:\s*(.*)$/

            );

        if (!resultado) {

            return null;

        }

        const nome =

            resultado[1].trim();

        //------------------------------------------
        // Evitar interpretar frases comuns
        // contendo ":" como personagem
        //------------------------------------------

        if (

            nome.length === 0

        ) {

            return null;

        }

        //------------------------------------------
        // Ignorar Narrador como personagem
        // ainda será tratado como narração
        //------------------------------------------

        if (

            nome

                .normalize("NFD")

                .replace(

                    /[\u0300-\u036f]/g,

                    ""

                )

                .trim()

                .toUpperCase()

                === "NARRADOR"

        ) {

            return {

                speaker: "Narrador",

                texto:

                    resultado[2].trim()

            };

        }

        return {

            speaker: nome,

            texto:

                resultado[2].trim()

        };

    }

    //--------------------------------------------------
    // IDENTIFICAR TRANSIÇÃO
    //--------------------------------------------------

    ehTransicao(linha) {

        return (

            linha

                .replace(/\s/g, "")

                .match(/^\.+$/)

        );

    }

    //--------------------------------------------------
    // IDENTIFICAR POSSÍVEL NARRAÇÃO
    //--------------------------------------------------

    pareceNarracao(linha) {

        //------------------------------------------
        // Se começa com letra maiúscula e
        // parece uma descrição de ação,
        // tratar como narração
        //------------------------------------------

        const palavrasNarrativas = [

            "ELE ",

            "ELA ",

            "OS ",

            "AS ",

            "O ",

            "A ",

            "UM ",

            "UMA ",

            "DO ",

            "DA ",

            "DOS ",

            "DAS ",

            "NO ",

            "NA ",

            "NOS ",

            "NAS ",

            "DEPOIS ",

            "ENTÃO ",

            "NOVAMENTE ",

            "ENQUANTO ",

            "QUANDO ",

            "APÓS ",

            "ANTES "

        ];

        const inicio =

            linha

                .normalize("NFD")

                .replace(

                    /[\u0300-\u036f]/g,

                    ""

                )

                .toUpperCase();

        for (

            const palavra

            of palavrasNarrativas

        ) {

            if (

                inicio.startsWith(

                    palavra

                )

            ) {

                return true;

            }

        }

        //------------------------------------------
        // Frases que começam com nome próprio
        // podem ser narração
        //------------------------------------------

        if (

            /^[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ][a-záéíóúàâêôãõç]+(\s+[a-záéíóúàâêôãõç]+)*\s+(faz|fica|olha|anda|corre|começa|começam|vai|vão|se|nota|observa|aparece|surge|avança|avançam|entra|entram|sai|saem|diz|grita|fala|comenta|pensa|respira|caminha|levanta|cai|caem|ataca|atacam|tenta|tentam)\b/

                .test(linha)

        ) {

            return true;

        }

        //------------------------------------------
        // Por padrão, considerar continuação
        // da fala
        //------------------------------------------

        return false;

    }

    //--------------------------------------------------
    // ADICIONAR DIÁLOGO
    //--------------------------------------------------

    adicionarDialogo(

        speaker,

        partes,

        capitulo

    ) {

        const texto = partes

            .join(" ")

            .replace(/\s+/g, " ")

            .trim();

        if (

            texto === ""

        ) {

            return;

        }

        const caixas =

            this.compositor.dividir(

                texto

            );

        const imagem =

            resolverImagemPersonagem(

                speaker,

                capitulo

            );

        for (

            const caixa of caixas

        ) {

            this.story.push({

                type:

                    "dialogue",

                speaker:

                    speaker,

                image:

                    imagem,

                text:

                    caixa

            });

        }

    }

    //--------------------------------------------------
    // ADICIONAR NARRAÇÃO
    //--------------------------------------------------

    adicionarNarracao(

        partes

    ) {

        const texto = partes

            .join(" ")

            .replace(/\s+/g, " ")

            .trim();

        if (

            texto === ""

        ) {

            return;

        }

        const caixas =

            this.compositor.dividir(

                texto

            );

        for (

            const caixa of caixas

        ) {

            this.story.push({

                type:

                    "narration",

                speaker:

                    "Narrador",

                image:

                    "personagens/NARRAÇÃO.png",

                text:

                    caixa

            });

        }

    }

    //--------------------------------------------------
    // ADICIONAR TRANSIÇÃO
    //--------------------------------------------------

    adicionarTransicao() {

        this.story.push({

            type:

                "scene_break",

            speaker:

                "",

            image:

                "",

            text:

                "..."

        });

    }

}

//==================================================
// WARRING CONVERTER
// PARTE 6 — CONVERSOR PRINCIPAL
//==================================================

class Conversor {

    constructor() {

        this.normalizador =

            new NormalizadorTexto();

        this.parser =

            new Parser(this);

        this.story = [];

        this.arquivoAtual = null;

        this.capituloAtual = "";

    }

    //--------------------------------------------------
    // LIMPAR STORY
    //--------------------------------------------------

    limpar() {

        this.story = [];

    }

    //--------------------------------------------------
    // ADICIONAR CENA
    //--------------------------------------------------

    adicionar(cena) {

        this.story.push({

            ...cena,

            id:

                this.story.length + 1

        });

    }

    //--------------------------------------------------
    // RESOLVER IMAGEM
    //--------------------------------------------------

    imagem(nome) {

        return resolverImagemPersonagem(

            nome,

            this.capituloAtual

        );

    }

    //--------------------------------------------------
    // CONVERTER ARQUIVO
    //--------------------------------------------------

    async converterArquivo(

        arquivo

    ) {

        if (!arquivo) {

            throw new Error(

                "Nenhum arquivo selecionado."

            );

        }

        //------------------------------------------
        // Verificar extensão
        //------------------------------------------

        if (

            !arquivo.name

                .toLowerCase()

                .endsWith(

                    CONFIG.extensaoEntrada

                )

        ) {

            throw new Error(

                "O arquivo selecionado não é um .txt."

            );

        }

        //------------------------------------------
        // Guardar arquivo
        //------------------------------------------

        this.arquivoAtual =

            arquivo;

        //------------------------------------------
        // Descobrir capítulo
        //------------------------------------------

        this.capituloAtual =

            this.obterNumeroCapitulo(

                arquivo.name

            );

        //------------------------------------------
        // Ler arquivo
        //------------------------------------------

        const textoOriginal =

            await arquivo.text();

        //------------------------------------------
        // Normalizar texto
        //------------------------------------------

        const textoNormalizado =

            this.normalizador.normalizar(

                textoOriginal

            );

        //------------------------------------------
// TESTE — TEXTO ENVIADO AO PARSER
//------------------------------------------

console.log(

    "===================================="

);

console.log(

    "TEXTO ENVIADO AO PARSER:"

);

console.log(

    textoNormalizado

);

console.log(

    "===================================="
);

//------------------------------------------
// Interpretar texto
//------------------------------------------

this.story = this.parser.interpretar(

    textoNormalizado,

    this.capituloAtual

);

//--------------------------------------------------
// TÍTULO PRINCIPAL DO JOGO — APENAS CAPÍTULO 1
//--------------------------------------------------

if (

    this.capituloAtual === "1"

) {

    this.story.unshift({

        type: "game_title",

        title: "Warring",

        image:

            CONFIG.pastaImagens +

            "WARRING TITULO.png",

        text: ""

    });

}

        //------------------------------------------
        // Verificar resultado
        //------------------------------------------

        if (

            this.story.length === 0

        ) {

            throw new Error(

                "Nenhuma cena foi encontrada no arquivo."

            );

        }

        //------------------------------------------
        // Retornar resultado
        //------------------------------------------

        return this.story;

    }

    //--------------------------------------------------
    // OBTER NÚMERO DO CAPÍTULO
    //--------------------------------------------------

    obterNumeroCapitulo(

        nomeArquivo

    ) {

        const resultado =

            nomeArquivo.match(

                /cap(?:itulo)?[_-]?(\d+)/i

            );

        if (!resultado) {

            return "0";

        }

        return String(

            parseInt(

                resultado[1],

                10

            )

        );

    }

    //--------------------------------------------------
    // GERAR JSON
    //--------------------------------------------------

    gerarJSON() {

        if (

            this.story.length === 0

        ) {

            throw new Error(

                "Nenhum capítulo foi convertido."

            );

        }

        return JSON.stringify(

            this.story,

            null,

            4

        );

    }

    //--------------------------------------------------
    // BAIXAR JSON
    //--------------------------------------------------

    baixarJSON() {

        const json =

            this.gerarJSON();

        //------------------------------------------
        // Nome do arquivo
        //------------------------------------------

        let nomeArquivo =

            "cap01.json";

        if (

            this.arquivoAtual

        ) {

            nomeArquivo =

                this.arquivoAtual.name

                    .replace(

                        /\.txt$/i,

                        ".json"

                    );

        }

        //------------------------------------------
        // Criar arquivo
        //------------------------------------------

        const blob =

            new Blob(

                [json],

                {

                    type:

                        "application/json;charset=utf-8"

                }

            );

        //------------------------------------------
        // Criar URL
        //------------------------------------------

        const url =

            URL.createObjectURL(

                blob

            );

        //------------------------------------------
        // Criar link
        //------------------------------------------

        const link =

            document.createElement(

                "a"

            );

        link.href =

            url;

        link.download =

            nomeArquivo;

        //------------------------------------------
        // Executar download
        //------------------------------------------

        document.body.appendChild(

            link

        );

        link.click();

        //------------------------------------------
        // Limpar
        //------------------------------------------

        document.body.removeChild(

            link

        );

        URL.revokeObjectURL(

            url

        );

    }

}

//==================================================
// WARRING CONVERTER
// PARTE 7 — INTERFACE
//==================================================

class App {

    constructor() {

        //------------------------------------------
        // Elementos da interface
        //------------------------------------------

        this.arquivo =

            document.getElementById(

                "arquivo"

            );

        this.botaoConverter =

            document.getElementById(

                "converter"

            );

        this.botaoBaixar =

            document.getElementById(

                "baixar"

            );

        this.status =

            document.getElementById(

                "status"

            );

        //------------------------------------------
        // Criar conversor
        //------------------------------------------

        this.conversor =

            new Conversor();

        //------------------------------------------
        // Eventos
        //------------------------------------------

        this.configurarEventos();

    }

    //--------------------------------------------------
    // CONFIGURAR EVENTOS
    //--------------------------------------------------

    configurarEventos() {

        //------------------------------------------
        // Selecionar arquivo
        //------------------------------------------

        this.arquivo.addEventListener(

            "change",

            () => {

                if (

                    this.arquivo.files.length === 0

                ) {

                    this.status.textContent =

                        "Aguardando arquivo...";

                    return;

                }

                const arquivoSelecionado =

                    this.arquivo.files[0];

                this.status.textContent =

                    "Arquivo selecionado: " +

                    arquivoSelecionado.name;

                this.botaoBaixar.disabled =

                    true;

            }

        );

        //------------------------------------------
        // Converter
        //------------------------------------------

        this.botaoConverter.addEventListener(

            "click",

            async () => {

                await this.converter();

            }

        );

        //------------------------------------------
        // Baixar JSON
        //------------------------------------------

        this.botaoBaixar.addEventListener(

            "click",

            () => {

                this.baixar();

            }

        );

    }

    //--------------------------------------------------
    // CONVERTER
    //--------------------------------------------------

    async converter() {

        //------------------------------------------
        // Verificar arquivo
        //------------------------------------------

        if (

            this.arquivo.files.length === 0

        ) {

            this.status.textContent =

                "Selecione um arquivo .txt primeiro.";

            return;

        }

        //------------------------------------------
        // Obter arquivo
        //------------------------------------------

        const arquivo =

            this.arquivo.files[0];

        //------------------------------------------
        // Atualizar interface
        //------------------------------------------

        this.botaoConverter.disabled =

            true;

        this.botaoBaixar.disabled =

            true;

        this.status.textContent =

            "Convertendo...";

        //------------------------------------------
        // Limpar Console
        //------------------------------------------

        if (

            CONFIG.limparConsoleAoConverter

        ) {

            console.clear();

        }

        try {

            //--------------------------------------
            // Converter
            //--------------------------------------

            const story =

                await this.conversor

                    .converterArquivo(

                        arquivo

                    );

            //--------------------------------------
            // Mostrar resultado
            //--------------------------------------

            this.status.textContent =

                "Conversão concluída: " +

                story.length +

                " cenas geradas.";

            //--------------------------------------
            // Liberar download
            //--------------------------------------

            this.botaoBaixar.disabled =

                false;

            //--------------------------------------
            // Console
            //--------------------------------------

            if (

                CONFIG.mostrarMensagensConsole

            ) {

                console.log(

                    "Capítulo convertido:",

                    arquivo.name

                );

                console.log(

                    "Cenas geradas:",

                    story.length

                );

                console.log(

                    story

                );

            }

        }

        catch (erro) {

            //--------------------------------------
            // Mostrar erro
            //--------------------------------------

            console.error(

                "Erro durante a conversão:",

                erro

            );

            this.status.textContent =

                "Erro: " +

                erro.message;

        }

        finally {

            //--------------------------------------
            // Liberar botão
            //--------------------------------------

            this.botaoConverter.disabled =

                false;

        }

    }

    //--------------------------------------------------
    // BAIXAR
    //--------------------------------------------------

    baixar() {

        try {

            this.conversor

                .baixarJSON();

            this.status.textContent =

                "JSON baixado com sucesso.";

        }

        catch (erro) {

            console.error(

                "Erro ao baixar JSON:",

                erro

            );

            this.status.textContent =

                "Erro ao baixar JSON.";

        }

    }

}


//==================================================
// INICIAR APLICAÇÃO
//==================================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        window.warringConverter =

            new App();

    }

);