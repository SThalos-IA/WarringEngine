//==================================================
// REGRAS DO PARSER
//==================================================

const REGRAS = {

    //----------------------------------------------
    // Linha de diálogo
    //----------------------------------------------

    dialogo(linha) {

        return /^[^:]+:/.test(linha);

    },

    //----------------------------------------------
    // Mudança de cena
    //----------------------------------------------

    cena(linha) {

        return linha === "...";

    },

    //----------------------------------------------
    // Linha vazia
    //----------------------------------------------

    vazia(linha) {

        return linha.trim() === "";

    },

    //----------------------------------------------
    // Ação dentro da fala
    //----------------------------------------------

    acao(linha) {

        return /^[-–—]/.test(linha);

    },

    //----------------------------------------------
    // Continuação da fala
    //----------------------------------------------

    continuaDialogo(linha) {

        if (this.acao(linha)) {

            return true;

        }

        const primeira = linha.charAt(0);

        if (primeira === "") {

            return false;

        }

        return (

            primeira === primeira.toLowerCase() &&

            primeira !== primeira.toUpperCase()

        );

    }

};