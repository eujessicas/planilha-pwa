// ===== Dados =====
let lancamentos = JSON.parse(localStorage.getItem("meuCaixa")) || [];


// ===== Elementos =====
const btnExportar = document.getElementById("btnExportar");
const modal = document.getElementById("modal");
const fab = document.querySelector(".fab");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

const tipo = document.getElementById("tipo");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");

const saldo = document.getElementById("saldo");
const totalEntrada = document.getElementById("totalEntrada");
const totalSaida = document.getElementById("totalSaida");
const lista = document.getElementById("lista");


// ===== Eventos =====
btnExportar.addEventListener("click", exportarDados);

fab.addEventListener("click", abrirModal);

btnCancelar.addEventListener("click", fecharModal);

btnSalvar.addEventListener("click", salvarLancamento);


// ===== Funções =====

function abrirModal() {
    modal.classList.remove("oculto");
}


function fecharModal() {

    modal.classList.add("oculto");

    descricao.value = "";
    valor.value = "";
    tipo.value = "entrada";

}



function salvarLancamento() {


    if (descricao.value.trim() === "" || valor.value === "") {

        alert("Preencha todos os campos.");

        return;
    }


    const novoLancamento = {

        id: Date.now(),

        tipo: tipo.value,

        descricao: descricao.value,

        valor: Number(valor.value),

        data: new Date().toLocaleDateString("pt-BR")

    };


    lancamentos.push(novoLancamento);


    salvarLocalStorage();


    atualizarTela();


    fecharModal();

}

function exportarDados(){

    if(lancamentos.length === 0){

        alert("Não existem lançamentos para exportar.");

        return;
    }


    let csv = "Data;Tipo;Descrição;Valor\n";


    lancamentos.forEach(item => {


        csv += `${item.data};`;

        csv += `${item.tipo};`;

        csv += `${item.descricao};`;

        csv += `${item.valor.toFixed(2)}\n`;


    });



    const arquivo = new Blob(
        [csv],
        {
            type:"text/csv;charset=utf-8;"
        }
    );


    const link = document.createElement("a");


    link.href = URL.createObjectURL(arquivo);


    link.download = "meu-caixa.csv";


    link.click();

}


function atualizarTela() {


    lista.innerHTML = "";


    let entradas = 0;

    let saidas = 0;



    if (lancamentos.length === 0) {

        lista.innerHTML = "<p>Nenhum lançamento.</p>";

    }



    lancamentos.forEach(item => {



        if (item.tipo === "entrada") {

            entradas += item.valor;

        } else {

            saidas += item.valor;

        }



        lista.innerHTML += `

            <div class="item">


                <div>

                    <h4>${item.descricao}</h4>

                    <small>${item.data}</small>

                </div>



                <div class="acoes-item">


                    <div class="${item.tipo === "entrada" ? "valor-entrada" : "valor-saida"}">

                        ${item.tipo === "entrada" ? "+" : "-"}

                        ${item.valor.toLocaleString("pt-BR", {
                            style:"currency",
                            currency:"BRL"
                        })}

                    </div>



                    <button 
                        class="btnExcluir"
                        data-id="${item.id}">
                        🗑️
                    </button>


                </div>


            </div>

        `;

    });



    // Eventos dos botões excluir

    document.querySelectorAll(".btnExcluir").forEach(botao => {


        botao.addEventListener("click", () => {


            const id = Number(botao.dataset.id);


            excluirLancamento(id);


        });


    });




    saldo.textContent = (entradas - saidas).toLocaleString("pt-BR", {

        style:"currency",

        currency:"BRL"

    });



    totalEntrada.textContent = entradas.toLocaleString("pt-BR", {

        style:"currency",

        currency:"BRL"

    });



    totalSaida.textContent = saidas.toLocaleString("pt-BR", {

        style:"currency",

        currency:"BRL"

    });


}




function excluirLancamento(id) {


    const confirmar = confirm(
        "Deseja excluir este lançamento?"
    );


    if (!confirmar) {

        return;

    }



    lancamentos = lancamentos.filter(item => item.id !== id);



    salvarLocalStorage();



    atualizarTela();


}




function salvarLocalStorage() {

    localStorage.setItem(
        "meuCaixa",
        JSON.stringify(lancamentos)
    );

}



// ===== Inicialização =====

atualizarTela();