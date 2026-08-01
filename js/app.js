// ===== Dados =====
let lancamentos = JSON.parse(localStorage.getItem("meuCaixa")) || [];

// ===== Filtros =====
let mesAtual = new Date().toISOString().slice(0, 7);
let categoriaAtual = "Todas";
let tipoSelecionado = "entrada";

// ===== Elementos =====
const categoria = document.getElementById("categoria");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");

const saldo = document.getElementById("saldo");
const totalEntrada = document.getElementById("totalEntrada");
const totalSaida = document.getElementById("totalSaida");
const lista = document.getElementById("lista");

const modal = document.getElementById("modal");
const fab = document.querySelector(".fab");

const btnSalvar = document.getElementById("btnSalvar");
const btnFechar = document.getElementById("btnFechar");

const btnEntrada = document.getElementById("btnEntrada");
const btnSaida = document.getElementById("btnSaida");

const btnExportar = document.getElementById("btnExportar");

const mesFiltro = document.getElementById("mesFiltro");
const filtroCategoria = document.getElementById("filtroCategoria");

// ===== Inicialização =====
mesFiltro.value = mesAtual;

// ===== Eventos =====
fab.addEventListener("click", abrirModal);

btnFechar.addEventListener("click", fecharModal);

btnSalvar.addEventListener("click", salvarLancamento);

btnExportar.addEventListener("click", exportarDados);

mesFiltro.addEventListener("change", () => {
    mesAtual = mesFiltro.value;
    atualizarTela();
});

filtroCategoria.addEventListener("change", () => {
    categoriaAtual = filtroCategoria.value;
    atualizarTela();
});

btnEntrada.addEventListener("click", () => {

    tipoSelecionado = "entrada";

    btnEntrada.classList.add("ativo");
    btnSaida.classList.remove("ativo");

});

btnSaida.addEventListener("click", () => {

    tipoSelecionado = "saida";

    btnSaida.classList.add("ativo");
    btnEntrada.classList.remove("ativo");

});

// ===== Modal =====

function abrirModal(){

    modal.classList.remove("oculto");

}

function fecharModal(){

    modal.classList.add("oculto");

    categoria.selectedIndex = 0;
    descricao.value = "";
    valor.value = "";

    tipoSelecionado = "entrada";

    btnEntrada.classList.add("ativo");
    btnSaida.classList.remove("ativo");

}

// ===== Salvar =====

function salvarLancamento(){

    if(
        descricao.value.trim()==="" ||
        valor.value===""
    ){

        alert("Preencha todos os campos.");

        return;

    }

    const agora = new Date();

    const novoLancamento = {

        id: Date.now(),

        tipo: tipoSelecionado,

        categoria: categoria.value,

        descricao: descricao.value,

        valor: Number(valor.value),

        data: agora.toLocaleDateString("pt-BR"),

        mes: agora.toISOString().slice(0,7)

    };

    lancamentos.push(novoLancamento);

    salvarLocalStorage();

    atualizarTela();

    fecharModal();

}

// ===== Atualizar Tela =====

function atualizarTela(){

    lista.innerHTML="";

    let entradas=0;
    let saidas=0;

    let dados=lancamentos.filter(item=>item.mes===mesAtual);

    if(categoriaAtual!=="Todas"){

        dados=dados.filter(
            item=>item.categoria===categoriaAtual
        );

    }

    if(dados.length===0){

        lista.innerHTML="<p>Nenhum lançamento encontrado.</p>";

    }

    dados.forEach(item=>{

        if(item.tipo==="entrada"){

            entradas+=item.valor;

        }else{

            saidas+=item.valor;

        }

        lista.innerHTML+=`

        <div class="item">

            <div>

                <h4>${item.categoria}</h4>

                <small>${item.descricao} • ${item.data}</small>

            </div>

            <div class="acoes-item">

                <div class="${
                    item.tipo==="entrada"
                    ? "valor-entrada"
                    : "valor-saida"
                }">

                    ${
                        item.tipo==="entrada"
                        ? "+"
                        : "-"
                    }

                    ${item.valor.toLocaleString("pt-BR",{
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

    document.querySelectorAll(".btnExcluir").forEach(botao=>{

        botao.addEventListener("click",()=>{

            excluirLancamento(
                Number(botao.dataset.id)
            );

        });

    });

    saldo.textContent=(entradas-saidas).toLocaleString("pt-BR",{

        style:"currency",
        currency:"BRL"

    });

    totalEntrada.textContent=entradas.toLocaleString("pt-BR",{

        style:"currency",
        currency:"BRL"

    });

    totalSaida.textContent=saidas.toLocaleString("pt-BR",{

        style:"currency",
        currency:"BRL"

    });

}

// ===== Exportar =====

function exportarDados(){

    let dados=lancamentos.filter(item=>item.mes===mesAtual);

    if(categoriaAtual!=="Todas"){

        dados=dados.filter(
            item=>item.categoria===categoriaAtual
        );

    }

    if(dados.length===0){

        alert("Não existem lançamentos.");

        return;

    }

    let csv="Data;Tipo;Categoria;Descrição;Valor\n";

    dados.forEach(item=>{

        csv+=`${item.data};`;
        csv+=`${item.tipo};`;
        csv+=`${item.categoria};`;
        csv+=`${item.descricao};`;
        csv+=`${item.valor.toFixed(2)}\n`;

    });

    const arquivo=new Blob([csv],{

        type:"text/csv;charset=utf-8;"

    });

    const link=document.createElement("a");

    link.href=URL.createObjectURL(arquivo);

    link.download=`meu-caixa-${mesAtual}.csv`;

    link.click();

}

// ===== Excluir =====

function excluirLancamento(id){

    if(!confirm("Deseja excluir este lançamento?")){

        return;

    }

    lancamentos=lancamentos.filter(item=>item.id!==id);

    salvarLocalStorage();

    atualizarTela();

}

// ===== LocalStorage =====

function salvarLocalStorage(){

    localStorage.setItem(
        "meuCaixa",
        JSON.stringify(lancamentos)
    );

}

// ===== Iniciar =====

atualizarTela();