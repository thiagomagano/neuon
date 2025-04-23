// Esta função inicializa os triggers do modal para todos os botões relevantes
function initModalTriggers() {
  // Seletores para botões que devem abrir o modal
  const buttonSelectors = [
    'a[href="#Contato"]',
    "a.contact-trigger", // Classe opcional que você pode adicionar a qualquer botão
  ];

  // Evento customizado para abrir o modal
  const openModalEvent = new Event("openContactModal");

  // Encontra todos os botões que correspondem aos seletores
  const buttons = document.querySelectorAll(buttonSelectors.join(", "));

  // Adiciona listener de clique a cada botão
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // Evita navegação padrão para âncoras

      // Dispara o evento para abrir o modal
      document.dispatchEvent(openModalEvent);

      // Alternativa: chamar diretamente se disponível
      if (window.openContactModal) {
        window.openContactModal();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initModalTriggers);

document.addEventListener("astro:page-load", initModalTriggers);
