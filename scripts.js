// Envia os dados usando EmailJS ao clicar no botão "Enviar"
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function () {
  const items = expenseList.children;

  if (items.length === 0) {
    alert("Adicione pelo menos um material antes de enviar.");
    return;
  }

  let listaMateriais = "";

  for (let item of items) {
    const descricao = item.querySelector("strong").textContent;
    const setor = item.querySelector("span").textContent;
    const quantidade = item.querySelector(".expense-amount").textContent;

    listaMateriais += `Setor: ${setor} | Material: ${descricao} | Quantidade: ${quantidade}\n`;
  }

  const templateParams = {
    message: listaMateriais,
  };

  emailjs
    .send("service_xnl6g1s", "template_12s0ni8", templateParams)
    .then(() => {
      alert("Materiais enviados com sucesso!");

      // Limpa a lista após o envio
      expenseList.innerHTML = "";

      // Atualiza a contagem
      updateQuantity();

      // Foca de volta no input principal
      expense.focus();
    })
    .catch((error) => {
      console.error("Erro ao enviar:", error);
      alert("Falha ao enviar materiais.");
    });
});
