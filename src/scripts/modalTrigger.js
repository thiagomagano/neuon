// src/scripts/modalTrigger.js

// Esta função inicializa os triggers para os diferentes modais
function initModalTriggers() {
  // Configuração dos diferentes tipos de modais
  const modals = [
    {
      // Modal de contato
      selectors: [
        'a[href="#Contato"]:not([data-modal="careers"])',
        "a.contact-trigger",
      ],
      event: "openContactModal",
    },
    {
      // Modal de candidaturas
      selectors: [
        'a[href="#Trabalhe-Conosco"]',
        'a[href="#Contato"][data-modal="careers"]',
        "a.careers-trigger",
      ],
      event: "openCareersModal",
    },
  ];

  // Processar cada tipo de modal
  modals.forEach((modal) => {
    // Cria evento customizado para este tipo de modal
    const openModalEvent = new Event(modal.event);

    // Encontra todos os botões que correspondem aos seletores
    const buttons = document.querySelectorAll(modal.selectors.join(", "));

    // Adiciona listener de clique a cada botão
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault(); // Evita navegação padrão para âncoras

        // Dispara o evento para abrir o modal
        document.dispatchEvent(openModalEvent);

        // Alternativa: chamar diretamente se disponível
        const globalFunction = window[modal.event];
        if (typeof globalFunction === "function") {
          globalFunction();
        }
      });
    });
  });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", initModalTriggers);

// Reinicializa após carregamento de conteúdo dinâmico ou navegação por SPA
document.addEventListener("astro:page-load", initModalTriggers);
