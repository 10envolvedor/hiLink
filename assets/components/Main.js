function Main() {
  const saveUrlRef = React.useRef(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [urlForCreateModal, setUrlForCreateModal] = React.useState("");
  const [alertContent, setAlertContent] = React.useState(null);
  const [editingLink, setEditingLink] = React.useState(null); // Novo estado para o link em edição

  // Função para abrir o modal detalhado
  const handleOpenDetalhado = (url) => {
    setUrlForCreateModal(url);
    setShowCreateModal(true);
  };

  // Função para abrir o modal de edição
  const handleOpenEdit = (link) => {
    setEditingLink(link);
  };

  // Função para mostrar um alerta genérico
  const showAlert = (content) => {
    setAlertContent(content);
  };

  const closeAlert = () => {
    setAlertContent(null);
  };

  // Função para fechar o modal detalhado
  // Se for chamado após salvar, limpe o input principal
  const handleCloseModal = (limparInput = false) => {
    setShowCreateModal(false);
    setEditingLink(null); // Garante que o modal de edição também feche
    if (limparInput) {
      // Limpa o input principal apenas na criação de um novo link
      saveUrlRef.current?.clearUrl();
    }
  };

  return (
    <main className="dark:bg-gray-900">
      <SaveUrl
        ref={saveUrlRef}
        required={true}
        onDetalhadoClick={handleOpenDetalhado}
        onShowAlert={showAlert}
      />
      <UrlItem saveUrlRef={saveUrlRef} onEditClick={handleOpenEdit} />
      {(showCreateModal || editingLink) && (
        <Modal onClose={() => handleCloseModal(false)}>
          <LinkManager
            linkToEdit={editingLink}
            initialUrl={urlForCreateModal}
            onSave={() => handleCloseModal(!editingLink)} // Limpa o input principal apenas na criação
            onCancel={() => handleCloseModal(false)}
            onShowAlert={showAlert}
          />
        </Modal>
      )}
      {alertContent && <AlertModal content={alertContent} onClose={closeAlert} />}
    </main>
  );
}

// Componente de Alerta Genérico
function AlertModal({ content, onClose }) {
  // Foca no botão OK ao abrir para acessibilidade
  const okButtonRef = React.useRef(null);
  React.useEffect(() => {
    okButtonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-60"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full text-center"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="text-red-500 mb-4">
          <i className="fa-solid fa-circle-exclamation fa-3x"></i>
        </div>
        <h3 className="text-lg font-bold mb-2 dark:text-white">{content.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{content.text}</p>
        <button
          ref={okButtonRef}
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          OK
        </button>
      </div>
    </div>
  );
}
//   fazer botao de excluir todos

// Modal simples
function Modal({ children, onClose }) {
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 relative min-w-[350px] max-w-lg w-full">
        <button onClick={() => onClose()} className="absolute top-2 right-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
          <i className="fa-solid fa-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
}
