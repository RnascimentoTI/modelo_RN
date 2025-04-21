// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");

// Captura o evento de input e permite apenas números inteiros
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // remove tudo que não for dígito
  amount.value = value;
};

// Captura o evento de submit do formulário
form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.textContent = parseInt(newExpense.amount);

    const removeIcon = document.createElement("img");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");
    removeIcon.classList.add("remove-icon");

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    formClear();
    updateQuantity();
  } catch (error) {
    alert("Não foi possível adicionar o material.");
    console.log(error);
  }
}

// Atualiza somente a quantidade de Materiais
function updateQuantity() {
  const items = expenseList.children;
  expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "Materiais" : "Material"}`;
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
  }
  updateQuantity();
});

// Limpa o formulário
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";
  expense.focus();
}

// Enviar os dados para o Formcarry quando o botão Enviar for clicado
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function () {
  const items = expenseList.children;
  const materiais = [];

  for (let item of items) {
    const material = {
      descricao: item.querySelector("strong").textContent,
      setor: item.querySelector("span").textContent,
      quantidade: item.querySelector(".expense-amount").textContent,
    };
    materiais.push(material);
  }

  // Formatando o corpo da requisição
  const data = new FormData();
  // Adicionando um campo para os materiais
  materiais.forEach((material, index) => {
    data.append(`material[${index}][descricao]`, material.descricao);
    data.append(`material[${index}][setor]`, material.setor);
    data.append(`material[${index}][quantidade]`, material.quantidade);
  });

  // Enviar os dados para o Formcarry
  fetch("https://formcarry.com/s/CQCMWqykwZZ", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        alert("Materiais enviados com sucesso!");
      } else {
        throw new Error("Erro ao enviar. Código: " + response.status);
      }
    })
    .catch((error) => {
      alert("Falha ao enviar materiais.");
      console.error(error);
    });
});

