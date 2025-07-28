function LinkManager({ initialUrl, onSave, onCancel, linkToEdit, onShowAlert }) {
  const { addLink, updateLink } = React.useContext(LinksContext);
  const isEditMode = !!linkToEdit;

  const [formState, setFormState] = React.useState({
    url: initialUrl || "",
    description: "",
    tags: ""
  });

  // Preenche o formulário se estivermos no modo de edição
  React.useEffect(() => {
    if (isEditMode) {
      setFormState({
        url: linkToEdit.url,
        description: linkToEdit.description || "",
        tags: (linkToEdit.tags || []).join(', ')
      });
    }
  }, [linkToEdit, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(fs => ({ ...fs, [name]: value }));
  };

  // Função para lidar com a adição de um novo link
  const handleSave = async (e) => {
    e.preventDefault();
    // Validação de URL
    const isValidUrl = (text) => {
      if (!text) return false;
      try {
        const url = new URL(text);
        return (
          (url.protocol === "http:" || url.protocol === "https:") &&
          url.hostname.includes(".")
        );
      } catch {
        return false;
      }
    };
    if (!formState.url || !isValidUrl(formState.url)) {
      onShowAlert?.({
        title: 'URL Inválida',
        text: 'Por favor, insira uma URL válida antes de salvar.',
      });
      return;
    }
    // Divide as tags, remove espaços, filtra vazios e usa um Set para garantir que sejam únicas.
    const tagsArray = [...new Set(
      formState.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    )];
    
    const linkData = {
      url: formState.url,
      description: formState.description,
      tags: tagsArray,
    };

    try {
      if (isEditMode) {
        // No modo de edição, chamamos updateLink
        await updateLink(linkToEdit.id, { ...linkData, isUpdated: true });
      } else {
        // No modo de criação, chamamos addLink com o objeto completo
        const newLink = {
          ...linkData,
          isFavorited: false,
          sharedCount: 0,
          accessedCount: 0,
          copiedCount: 0,
          favoritedCount: 0,
        };
        await addLink(newLink);
      }
      if (onSave) onSave(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar link:", error);
      onShowAlert?.({
        title: 'Erro ao Salvar',
        text: 'Não foi possível salvar o link. A URL já pode existir.',
      });
    }
  };

  return (
      <form onSubmit={handleSave}>
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? (
            <span className="break-all">Alterar Link: {linkToEdit.url}</span>
          ) : 'Novo Link Detalhado'}
        </h2>
        <div className="space-y-3">
          <label htmlFor="url" className="block mt-2 mb-1">URL: <span className="text-red-500">*</span></label>
          <input
            name="url"
            id="url"
            value={formState.url}
            onChange={handleInputChange}
            placeholder="URL do Link (ex: https://google.com)"
            className={`w-full p-2 border rounded ${!isEditMode ? 'bg-gray-100 text-gray-800 cursor-not-allowed' : ''}`}
            required
            readOnly={!isEditMode}
          />
          <label htmlFor="description" className="block mt-2 mb-1">Descrição:</label>
          <textarea
            name="description"
            id="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Descrição do que o Link faz"
            className="w-full p-2 border rounded"
          />
          <label htmlFor="tags" className="block mt-2 mb-1">Tags:</label>
          <input
            name="tags"
            id="tags"
            value={formState.tags}
            onChange={handleInputChange}
            placeholder="Tags (separadas por vírgula)"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <i className="fa-solid fa-floppy-disk mr-2"></i>{isEditMode ? 'Salvar Alterações' : 'Salvar Link'}
        </button>
        <button type="button" onClick={onCancel} className="mt-4 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          <i className="fa-solid fa-xmark mr-2"></i>Cancelar
        </button>
      </form>
  );
} 