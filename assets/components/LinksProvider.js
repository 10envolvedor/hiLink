function LinksProvider({ children }) {
  // Toda a nossa lógica de estado agora vive aqui!
  const [links, setLinks] = React.useState(undefined); // undefined para preload

  // Carrega os dados iniciais do Dexie
  React.useEffect(() => {
    const fetchLinks = async () => {
      const allLinks = await db.links.toArray();
      setLinks(allLinks);
    };
    fetchLinks();
  }, []);

  // criar componente pra criar icone sobre icone com texto cada vez menor sobre o tamanho do texto do pai em né

  // Funções que modificam o estado. Elas também serão compartilhadas.
  const addLink = async (newLinkData) => {
    try {
      const id = await db.links.add(newLinkData);
      // Atualiza o estado local para que todos os componentes re-renderizem
      setLinks((prevLinks) => [...(prevLinks || []), { ...newLinkData, id }]);
    } catch (error) {
      console.error("Falha ao adicionar link:", error);
      throw error; // Lança o erro para que o formulário possa tratá-lo
    }
  };

  const deleteLink = async (id) => {
    setLinks((prevLinks) => (prevLinks || []).filter((link) => link.id !== id));
    await db.links.delete(id);
  };

  const updateLink = async (id, updatedData) => {
    // Atualiza no banco de dados
    await db.links.update(id, updatedData);
    // Atualiza na UI
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === id
          ? { ...link, ...updatedData, id } // Garante que o ID seja mantido
          : link
      )
    );
  };

  // Função para favoritar/desfavoritar
  const toggleFavorite = async (id, currentStatus) => {
    await db.links.update(id, { isFavorited: !currentStatus });
    // Atualiza o estado local para a UI refletir a mudança
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? { ...link, isFavorited: !currentStatus }
          : link // mantém referência original!
      )
    );
  };

  // Função para incrementar contadores (ex: compartilhamento)
  const incrementShare = async (id) => {
    // .modify() é ótimo para atualizações parciais
    await db.links.where({ id }).modify((link) => {
      link.sharedCount = (link.sharedCount || 0) + 1;
    });
    // Atualiza a UI
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? { ...link, sharedCount: (link.sharedCount || 0) + 1 }
          : link
      )
    );
  };

  // Função para incrementar o contador de favoritos
  const updateFavoriteCount = async (id, isFavoriting) => {
    await db.links.where({ id }).modify((link) => {
      const atual = link.favoritedCount || 0;
      link.favoritedCount = isFavoriting ? atual + 1 : Math.max(atual - 1, 0);
    });
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              favoritedCount: isFavoriting
                ? (link.favoritedCount || 0) + 1
                : Math.max((link.favoritedCount || 0) - 1, 0),
            }
          : link
      )
    );
  };

  // Função para incrementar o contador de acessos
  const incrementAccess = async (id) => {
    // Atualiza no banco
    await db.links.where({ id }).modify((link) => {
      link.accessCount = (link.accessCount || 0) + 1;
    });
    // Atualiza na UI
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? { ...link, accessCount: (link.accessCount || 0) + 1 }
          : link
      )
    );
  };

  // Função para incrementar o contador de cópias
  const incrementCopy = async (id) => {
    await db.links.where({ id }).modify((link) => {
      link.copyCount = (link.copyCount || 0) + 1;
    });
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? { ...link, copyCount: (link.copyCount || 0) + 1 }
          : link
      )
    );
  };

  // Função para remover uma tag de um link específico
  const removeTagFromLink = async (linkId, tagToRemove) => {
    // Atualiza no banco de dados
    await db.links.where({ id: linkId }).modify(link => {
      link.tags = link.tags.filter(tag => tag !== tagToRemove);
    });
    // Atualiza na UI
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId
          ? { ...link, tags: link.tags.filter(tag => tag !== tagToRemove) }
          : link
      )
    );
  };

  // Agrupamos tudo que queremos compartilhar em um único objeto
  const contextValue = {
    links,
    addLink,
    deleteLink,
    updateLink,
    toggleFavorite,
    incrementShare,
    updateFavoriteCount, // <-- novo nome
    incrementAccess, // <-- adicionado
    incrementCopy, // <-- adicionado
    removeTagFromLink, // <-- adicionado
    // Você pode adicionar outras funções aqui, como toggleFavorite, etc.
  };

  // O Provider "disponibiliza" o contextValue para todos os seus filhos
  return (
    <LinksContext.Provider value={contextValue}>
      {children}
    </LinksContext.Provider>
  );
}
