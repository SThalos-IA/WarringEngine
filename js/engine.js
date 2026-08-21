//==================================================
// SAVE / LOAD
//==================================================

const SAVE_KEY = "WARRING_SAVE";

//==================================================
// WARRING ENGINE 2.0
// PARTE 1
//==================================================

let story = [];

let current = 0;

let capituloAtual = "cap01";

let historico = [];

let historicoAberto = false;

//==================================================
// VARIÁVEIS DO JOGO
//==================================================

let game = {

    flags: {},

    escolhas: {},

    inventario: [],

    atributos: {}

};

//--------------------------------------------------
// Elementos principais
//--------------------------------------------------

const characterName = document.getElementById(

    "characterName"

);

const dialogue = document.getElementById(

    "dialogue"

);

const portrait = document.getElementById(

    "characterImage"

);

//--------------------------------------------------
// Menu
//--------------------------------------------------

const selectCapitulo = document.getElementById(

    "capitulo"

);

const btnAbrir = document.getElementById(

    "abrir"

);

const btnCapituloAnterior =

    document.getElementById(

        "capituloAnterior"

    );

const btnProximoCapitulo =

    document.getElementById(

        "proximoCapitulo"

    );

//--------------------------------------------------
// Navegação
//--------------------------------------------------

const btnNext = document.getElementById(

    "next"

);

const btnPrevious = document.getElementById(

    "previous"

);

//--------------------------------------------------
// Barra de progresso
//--------------------------------------------------

const chapterInfo = document.getElementById(

    "chapterInfo"

);

const sceneInfo = document.getElementById(

    "sceneInfo"

);

const progressBar = document.getElementById(

    "progressBar"

);

//--------------------------------------------------
// Histórico
//--------------------------------------------------

const historyPanel = document.getElementById(

    "historyPanel"

);

const historyContent = document.getElementById(

    "historyContent"

);

const fecharHistorico = document.getElementById(

    "fecharHistorico"

);

//==================================================
// WARRING ENGINE 2.0
// PARTE 2
//==================================================

//--------------------------------------------------
// Carregar capítulo
//--------------------------------------------------

async function carregarCapitulo(nome) {

    capituloAtual = nome;

    historico = [];

    historicoAberto = false;

    historyPanel.classList.add("hidden");

    try {

        const resposta = await fetch(

            `capitulos/${nome}.json`

        );

        if (!resposta.ok) {

            throw new Error(

                "Capítulo não encontrado."

            );

        }

        story = await resposta.json();

        current = 0;

        historyContent.innerHTML = "";

        atualizarCena();

    }

    catch (erro) {

        console.error(erro);

        characterName.textContent = "";

        dialogue.textContent =

            "Erro ao carregar o capítulo.";

        portrait.removeAttribute("src");

        portrait.alt = "";

        portrait.classList.add("hidden");

    }

}

//--------------------------------------------------
// Salvar progresso
//--------------------------------------------------

function salvarProgresso() {

    const save = {

        capitulo: capituloAtual,

        cena: current,

        game: game

    };

    localStorage.setItem(

        SAVE_KEY,

        JSON.stringify(save)

    );

}

//--------------------------------------------------
// Carregar progresso
//--------------------------------------------------

async function carregarProgresso() {

    const texto = localStorage.getItem(

        SAVE_KEY

    );

    if (!texto) {

        await carregarCapitulo("cap01");

        return;

    }

    const save = JSON.parse(texto);

    game = save.game || {

        flags:{},

        escolhas:{},

        inventario:[],

        atributos:{}

    };

    selectCapitulo.value = save.capitulo;

    await carregarCapitulo(

        save.capitulo

    );

    current = Math.min(

        save.cena,

        story.length-1

    );

    atualizarCena();

}

//--------------------------------------------------
// Novo jogo
//--------------------------------------------------

function novoJogo() {

    localStorage.removeItem(

        SAVE_KEY

    );

    carregarCapitulo(

        "cap01"

    );

}

//==================================================
// WARRING ENGINE 2.0
// PARTE 3
//==================================================

//--------------------------------------------------
// Atualizar histórico
//--------------------------------------------------

function atualizarHistorico(cena) {

    if (

        cena.type === "scene_break"

    ) {

        return;

    }

    if (

        historico.length > 0 &&

        historico[

            historico.length - 1

        ].id === cena.id

    ) {

        return;

    }

    historico.push(cena);

    historyContent.innerHTML = "";

    for (const item of historico) {

        const bloco =

            document.createElement("div");

        bloco.className =

            "historyItem";

        const nome =

            document.createElement("div");

        nome.className =

            "historySpeaker";

        nome.textContent =

            item.speaker;

        const texto =

            document.createElement("div");

        texto.className =

            "historyText";

        texto.textContent =

            item.text;

        bloco.appendChild(nome);

        bloco.appendChild(texto);

        historyContent.appendChild(bloco);

    }

    historyContent.scrollTop =

        historyContent.scrollHeight;

}

//--------------------------------------------------
// Resolver imagem do personagem
//--------------------------------------------------

function imagemPersonagem(nome) {

    if (!nome) {

        return "";

    }

    nome = nome

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/\s+/g," ")

        .trim()

        .toUpperCase();

    if (

        nome === "" ||

        nome === "NARRADOR"

    ) {

        return "";

    }

    const numeroCapitulo =

        parseInt(

            capituloAtual.replace(

                "cap",

                ""

            )

        );

    if (

        PERSONAGENS[nome]

    ) {

        return (

            "personagens/" +

            PERSONAGENS[nome](

                numeroCapitulo

            )

        );

    }

    return (

        "personagens/" +

        nome +

        ".png"

    );

}

//--------------------------------------------------
// Atualizar cena
//--------------------------------------------------

function atualizarCena() {

    document
        .querySelector("main")
        .classList
        .remove("chapterTitleMode");

    //------------------------------------------
    // Verificar se existe história
    //------------------------------------------

    if (story.length === 0) {

        return;

    }

    //------------------------------------------
    // Cena atual
    //------------------------------------------

    const cena = story[current];

    //------------------------------------------
    // Atualizar histórico
    //------------------------------------------

    atualizarHistorico(cena);

    //------------------------------------------
    // Atualizar informações do capítulo
    //------------------------------------------

    chapterInfo.textContent =

        "Capítulo " +

        capituloAtual.replace("cap", "");

    //------------------------------------------
    // Atualizar informações da cena
    //------------------------------------------

    sceneInfo.textContent =

        "Cena " +

        (current + 1) +

        " / " +

        story.length;

    //------------------------------------------
    // Atualizar barra de progresso
    //------------------------------------------

    progressBar.max = story.length;

    progressBar.value = current + 1;


    //--------------------------------------------------
    // TELA DE ABERTURA DO JOGO
    //--------------------------------------------------

    if (cena.type === "game_title") {

        //------------------------------------------
    // Ativar modo de capa
    //------------------------------------------

        document
    .querySelector("main")
    .classList
    .add("gameTitleMode");
        
        //------------------------------------------
        // Esconder área de texto
        //------------------------------------------ 

        textoArea.classList.add(

            "hidden"

        );

        //------------------------------------------
        // Limpar textos
        //------------------------------------------

        characterName.textContent = "";

        dialogue.textContent = "";

        //------------------------------------------
        // Aplicar modo de capa
        //------------------------------------------

        portrait.classList.add(

            "gameTitlePortrait"

        );

        //------------------------------------------
        // Mostrar imagem
        //------------------------------------------

        portrait.classList.remove(

            "hidden"

        );

        portrait.onload = () => {

            portrait.classList.remove(

                "hidden"

            );

        };

        portrait.onerror = () => {

            portrait.removeAttribute(

                "src"

            );

            portrait.classList.add(

                "hidden"

            );

        };

        portrait.src =

            cena.image || "";

        //------------------------------------------
        // Salvar progresso
        //------------------------------------------

        salvarProgresso();

        return;

    }


    //--------------------------------------------------
// VOLTAR AO LAYOUT NORMAL
//--------------------------------------------------

document
    .querySelector("main")
    .classList
    .remove("gameTitleMode");

textoArea.classList.remove(
    "hidden"
);

portrait.classList.remove(
    "gameTitlePortrait"
);


    //--------------------------------------------------
    // TÍTULO DO CAPÍTULO
    //--------------------------------------------------

    if (cena.type === "chapter_title") {

        //------------------------------------------
        // Ativar modo de título
        //------------------------------------------

        document

            .querySelector("main")

            .classList

            .add(

                "chapterTitleMode"

            );

        //------------------------------------------
        // Mostrar título
        //------------------------------------------

        characterName.textContent = "";

        dialogue.textContent =

            cena.title ||

            cena.text ||

            "";

        dialogue.classList.remove(

            "hidden"

        );

        //------------------------------------------
        // Mostrar imagem
        //------------------------------------------

        if (cena.image) {

            portrait.src =

                cena.image;

            portrait.classList.remove(

                "hidden"

            );

        }

        else {

            portrait.removeAttribute(

                "src"

            );

            portrait.classList.add(

                "hidden"

            );

        }

        //------------------------------------------
        // Salvar progresso
        //------------------------------------------

        salvarProgresso();

        return;

    }


    //--------------------------------------------------
// TRANSIÇÃO
//--------------------------------------------------

if (cena.type === "scene_break") {

    characterName.textContent = "";

    dialogue.textContent =
        "•••";

    // Usa exatamente a imagem definida no JSON
    if (cena.image) {

        portrait.src =
            cena.image;

    } else {

        // Compatibilidade com JSONs antigos
        portrait.src =
            "transicoes/" +
            capituloAtual +
            ".png";
    }

    portrait.classList.remove(
        "hidden"
    );

    salvarProgresso();

    return;
}


    //--------------------------------------------------
    // CENA NORMAL
    //--------------------------------------------------

    characterName.textContent =

        cena.speaker || "";

    dialogue.textContent =

        cena.text || "";


    //--------------------------------------------------
    // RESOLVER IMAGEM DA CENA
    //--------------------------------------------------

    let caminhoImagem = "";


    //------------------------------------------
    // Usar imagem definida diretamente no JSON
    //------------------------------------------

    if (cena.image) {

        caminhoImagem =

            cena.image;

    }


    //------------------------------------------
    // Caso não exista imagem no JSON,
    // buscar imagem do personagem
    //------------------------------------------

    else if (

        cena.type === "dialogue"

    ) {

        caminhoImagem =

            imagemPersonagem(

                cena.speaker

            );

    }


    //--------------------------------------------------
    // Mostrar imagem
    //--------------------------------------------------

    if (caminhoImagem) {

        portrait.onload = () => {

            portrait.classList.remove(

                "hidden"

            );

        };

        portrait.onerror = () => {

            portrait.removeAttribute(

                "src"

            );

            portrait.classList.add(

                "hidden"

            );

        };

        portrait.src =

            caminhoImagem;

    }

    else {

        portrait.onload = null;

        portrait.onerror = null;

        portrait.removeAttribute(

            "src"

        );

        portrait.classList.add(

            "hidden"

        );

    }


    //--------------------------------------------------
    // Salvar progresso
    //--------------------------------------------------

    salvarProgresso();

}

//==================================================
// WARRING ENGINE 2.0
// PARTE 4
//==================================================

//--------------------------------------------------
// Próxima cena
//--------------------------------------------------

function proximaCena() {

    if (

        historicoAberto

    ) {

        return;

    }

    if (

        current < story.length - 1

    ) {

        current++;

        salvarProgresso();

        atualizarCena();

    }

}

//--------------------------------------------------
// Cena anterior
//--------------------------------------------------

function cenaAnterior() {

    if (

        historicoAberto

    ) {

        return;

    }

    if (

        current > 0

    ) {

        current--;

        salvarProgresso();

        atualizarCena();

    }

}

//--------------------------------------------------
// Abrir capítulo
//--------------------------------------------------

function abrirCapitulo() {

    carregarCapitulo(

        selectCapitulo.value

    );

}

//--------------------------------------------------
// Abrir / Fechar histórico
//--------------------------------------------------

function alternarHistorico() {

    historicoAberto =

        !historicoAberto;

    historyPanel.classList.toggle(

        "hidden"

    );

}

//--------------------------------------------------
// Fechar histórico
//--------------------------------------------------

function fecharPainelHistorico() {

    historicoAberto = false;

    historyPanel.classList.add(

        "hidden"

    );

}

//==================================================
// WARRING ENGINE 2.0
// PARTE 5
//==================================================

//--------------------------------------------------
// Botões
//--------------------------------------------------

btnNext.addEventListener(

    "click",

    proximaCena

);

btnPrevious.addEventListener(

    "click",

    cenaAnterior

);

btnAbrir.addEventListener(

    "click",

    abrirCapitulo

);

btnCapituloAnterior.addEventListener(

    "click",

    capituloAnterior

);

btnProximoCapitulo.addEventListener(

    "click",

    proximoCapitulo

);

fecharHistorico.addEventListener(

    "click",

    fecharPainelHistorico

);

//--------------------------------------------------
// Teclado
//--------------------------------------------------

document.addEventListener(

    "keydown",

    (evento) => {

        switch (evento.key) {

            case "ArrowRight":

            case " ":

            case "Enter":

                proximaCena();

                break;

            case "ArrowLeft":

            case "Backspace":

                cenaAnterior();

                break;

            case "h":

            case "H":

                alternarHistorico();

                break;

            case "Escape":

                fecharPainelHistorico();

                break;

        }

    }

);

//--------------------------------------------------
// Clique na tela
//--------------------------------------------------

document

    .getElementById("game")

    .addEventListener(

        "click",

        (evento) => {

            if (

                evento.target.tagName === "BUTTON" ||

                evento.target.tagName === "SELECT" ||

                evento.target.tagName === "OPTION"

            ) {

                return;

            }

            if (

                historicoAberto

            ) {

                return;

            }

            proximaCena();

        }

    );

//--------------------------------------------------
// Roda do mouse
//--------------------------------------------------

document

    .getElementById("game")

    .addEventListener(

        "wheel",

        (evento) => {

            evento.preventDefault();

            if (

                historicoAberto

            ) {

                return;

            }

            if (

                evento.deltaY > 0

            ) {

                proximaCena();

            }

            else {

                cenaAnterior();

            }

        },

        {

            passive:false

        }

    );

    //==================================================
// WARRING ENGINE 2.0
// PARTE 6
//==================================================

//--------------------------------------------------
// Inicialização
//--------------------------------------------------

function inicializar() {

    if (

        selectCapitulo

    ) {

        selectCapitulo.value =

            capituloAtual;

    }

    carregarProgresso();
}

//==================================================
// WARRING ENGINE 2.0
// PARTE 7
// Verificações finais
//==================================================

//--------------------------------------------------
// Verificar elementos obrigatórios
//--------------------------------------------------

function verificarEngine() {

    const elementos = [

        ["characterName", characterName],

        ["dialogue", dialogue],

        ["characterImage", portrait],

        ["capitulo", selectCapitulo],

        ["abrir", btnAbrir],

        ["next", btnNext],

        ["previous", btnPrevious],

        ["chapterInfo", chapterInfo],

        ["sceneInfo", sceneInfo],

        ["progressBar", progressBar],

        ["historyPanel", historyPanel],

        ["historyContent", historyContent],

        ["fecharHistorico", fecharHistorico]

    ];

    for (const elemento of elementos) {

        if (!elemento[1]) {

            console.error(

                "Elemento não encontrado:",

                elemento[0]

            );

        }

    }

}

//--------------------------------------------------
// Pré-carregar imagens
//--------------------------------------------------

function preloadImagens() {

    const usadas = new Set();

    for (const cena of story) {

        if (

            !cena.image ||

            cena.image.trim() === ""

        ) {

            continue;

        }

        if (

            usadas.has(cena.image)

        ) {

            continue;

        }

        usadas.add(cena.image);

        const img = new Image();

        img.src =

            "personagens/" +

            cena.image;

    }

}

//--------------------------------------------------
// Recarregar capítulo
//--------------------------------------------------

async function recarregarCapitulo() {

    await carregarCapitulo(

        capituloAtual

    );

    preloadImagens();

}

//--------------------------------------------------
// Inicialização definitiva
//--------------------------------------------------

verificarEngine();

inicializar();

//==================================================
// WARRING ENGINE 2.0
// PARTE 8
//==================================================

//--------------------------------------------------
// Próximo capítulo
//--------------------------------------------------

function proximoCapitulo() {

    const indice =

        selectCapitulo.selectedIndex;

    if (

        indice >=

        selectCapitulo.options.length - 1

    ) {

        return;

    }

    selectCapitulo.selectedIndex =

        indice + 1;

    abrirCapitulo();

}

//--------------------------------------------------
// Capítulo anterior
//--------------------------------------------------

function capituloAnterior() {

    const indice =

        selectCapitulo.selectedIndex;

    if (

        indice <= 0

    ) {

        return;

    }

    selectCapitulo.selectedIndex =

        indice - 1;

    abrirCapitulo();

}

//==================================================
// API DO JOGO
//==================================================

function setFlag(nome,valor=true){

    game.flags[nome]=valor;

    salvarProgresso();

}

function getFlag(nome){

    return game.flags[nome]===true;

}

function setEscolha(nome,valor){

    game.escolhas[nome]=valor;

    salvarProgresso();

}

function getEscolha(nome){

    return game.escolhas[nome];

}

function addItem(item){

    if(

        !game.inventario.includes(item)

    ){

        game.inventario.push(item);

        salvarProgresso();

    }

}

function hasItem(item){

    return game.inventario.includes(item);

}

function setAtributo(nome,valor){

    game.atributos[nome]=valor;

    salvarProgresso();

}

function getAtributo(nome){

    return game.atributos[nome];

}

//--------------------------------------------------
// Capítulo anterior
//--------------------------------------------------

function capituloAnterior() {

    let numero =

        parseInt(

            capituloAtual.replace(

                "cap",

                ""

            )

        );

    if (numero > 1) {

        numero--;

    }

    const novoCapitulo =

        "cap" +

        String(numero)

            .padStart(2,"0");

    selectCapitulo.value =

        novoCapitulo;

    carregarCapitulo(

        novoCapitulo

    );

}

//--------------------------------------------------
// Próximo capítulo
//--------------------------------------------------

function proximoCapitulo() {

    let numero =

        parseInt(

            capituloAtual.replace(

                "cap",

                ""

            )

        );

    if (numero < 19) {

        numero++;

    }

    const novoCapitulo =

        "cap" +

        String(numero)

            .padStart(2,"0");

    selectCapitulo.value =

        novoCapitulo;

    carregarCapitulo(

        novoCapitulo

    );

}

document

    .getElementById(

        "capituloAnterior"

    )

    .addEventListener(

        "click",

        capituloAnterior

    );

document

    .getElementById(

        "proximoCapitulo"

    )

    .addEventListener(

        "click",

        proximoCapitulo

    );

    //--------------------------------------------------
// Banco de imagens dos personagens
//--------------------------------------------------

const PERSONAGENS = {

    "KYUK": (capitulo) => {

        if (capitulo >= 15) {

            return "KYUK FEITICEIRO.png";

        }

        if (capitulo >= 10) {

            return "KYUK ARMADURA.png";

        }

        return "KYUK.png";

    },

    "YUKIA": () => "YUKIA.png",

    "BARK": () => "BARK.png",

    "GYUDER": () => "GYUDER.png",

    "LYCIA": () => "LYCIA.png",

    "ELIPHAS": () => "ELIPHAS.png",

    "MAGO MESTRE": () => "ELIPHAS.png",

    "NYARI": (capitulo) => {

        if (capitulo >= 14) {

            return "NYARI II.png";

        }

        return "NYARI I.png";

    },

    "ELISA": (capitulo) => {

        if (capitulo >= 14) {

            return "ELISA II.png";

        }

        return "ELISA.png";

    }

};