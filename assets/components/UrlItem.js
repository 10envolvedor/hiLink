
function LinkCard({
  link,
  deleteLink,
  incrementShare, // A prop onToggleFavorite foi removida daqui e centralizada em UrlItem
  onToggleFavorite,
  incrementAccess,
  incrementCopy,
  removeTagFromLink,
  clearLinkUpdateFlag, // <-- Nova prop
  onEditClick,
  onShowAlert,
}) {
  const [copied, setCopied] = React.useState(false);
  const [isUpdated, setIsUpdated] = React.useState(false);

  const handleCopy = async () => {
    if (link.url) {
      try {
        await navigator.clipboard.writeText(link.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
        incrementCopy(link.id); // <-- registra a cópia
      } catch (e) {
        onShowAlert({
          title: "Erro ao Copiar",
          text: "Não foi possível copiar o link para a área de transferência.",
        });
      }
    }
  };

  // Este efeito gerencia a animação de destaque.
  React.useEffect(() => {
    // Se a prop 'isUpdated' do link for verdadeira...
    if (link.isUpdated) {
      // 1. Ativa o estado local para adicionar a classe de animação.
      setIsUpdated(true);
      // 2. Limpa a flag no estado global para que a animação não se repita.
      clearLinkUpdateFlag(link.id);
      // 3. Define um timer para remover a classe de animação após 3 segundos.
      const timer = setTimeout(() => setIsUpdated(false), 3000);
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado.
    }
  }, [link.isUpdated, link.id, clearLinkUpdateFlag]);

  return (
    // A classe 'animate-scale' é adicionada condicionalmente para o efeito de destaque.
    <div className={`animate-fade-in basis-auto gap-2 min-h-44 flex-grow flex-shrink md:min-w-[30%] lg:min-w-[25%] md:max-w-[58.333333%] xl:min-w-[20%] p-4 rounded-md flex flex-col bg-cover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md bg-gray-700 bg-[url('https://cdn.kimkim.com/files/a/images/0b0d435f5312aaa4ac2deabb36ed3c23b3c363ba/original-90ebc1384d9012d5623e91bb03dc37aa.jpg')] ${isUpdated ? 'animate-scale' : ''}`}>
      <div className="flex flex-row justify-between gap-2">
        <Tooltip
          button={
            <SquareIcon
              icon="fa-solid fa-bullhorn"
              className="text-white text-2xl"
              typeCursor="help"
            />
          }
        >
          <span className="flex flex-col gap-2 text-white text-sm">
            <p>
              {(link.accessCount || 0) + " "}
              {link.accessCount === 1 ? "Acesso" : "Acessos"}
            </p>
            {/* fazer singular e plural */}
            <p>
              {link.sharedCount +
                (link.sharedCount == 1
                  ? " Compartilhamento"
                  : " Compartilhamentos")}{" "}
            </p>
            <p>
              {(link.favoritedCount || 0) +
                (link.favoritedCount == 1 ? " Favoritada" : " Favoritadas")}
            </p>
            <p>
              {(link.copyCount || 0) + " "}
              {link.copyCount === 1 ? "Cópia" : "Cópias"}
            </p>
          </span>
        </Tooltip>

        <div className="flex flex-col gap-2">
          <SquareIcon
            icon="fa-solid fa-heart"
            className={`text-2xl ${
              link.isFavorited ? "text-red-500" : "text-white"
            }`} // A prop onToggleFavorite foi removida daqui e centralizada em UrlItem
            onClick={() => onToggleFavorite(link.id, link.isFavorited)} // This now correctly calls the prop
            title="Favoritar"
          />

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir em nova aba"
            onClick={(e) => {
              if (!link.url) {
                e.preventDefault();
                return;
              }
              incrementAccess(link.id);
            }}
          >
            <SquareIcon
              icon="fa-solid fa-up-right-from-square"
              className="text-white text-2xl cursor-pointer"
            />
          </a>

          <ShareButton
            title="Compartilhar"
            text="link compartilhado por"
            onSuccess={() => {
              incrementShare(link.id);
            }}
            url={link.url}
            onShowAlert={onShowAlert}
          />

          <ActionMenu
            button={
              <SquareIcon
                icon="fa-solid fa-ellipsis-vertical"
                className="text-white text-2xl"
              />
            }

            onAction={() => deleteLink(link)} // Passa o objeto link inteiro
          >
            <button title="Deletar">
              <SquareIcon
                icon="fa-solid fa-trash"
                className="text-red-500 hover:text-red-700"
              />
            </button>
          </ActionMenu>
        </div>
      </div>

      <div className="md:max-w-[calc(50dvw-7.0621rem)] xl:max-w-[calc(40dvw-13.0621rem)] flex flex-row justify-start items-center flex-wrap gap-2 flex-grow">
            {link.tags && link.tags.length > 0 ? (
              <SquareIcon
                icon="fa-solid fa-tags"
                className="text-white text-lg"
                typeCursor="default"
              />
            ) : (
              ""
            )}
            {link.tags && link.tags.length > 0
              ? link.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black w-fit text-sm p-2 text-white flex flex-row items-center content-center align-center justify-between rounded-md gap-2"
                  >
                    <span>{tag}</span>
                    <span className="">|</span>
                    <i
                      className="fa-solid fa-close cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => removeTagFromLink(link.id, tag)}
                      title={`Remover tag: ${tag}`}
                    ></i>
                  </span>
                ))
              : ""}
          </div>
      {/* modo escuro e claro, tem no gemini conversa sobre isso */}

      {/* confirmar ao excluir */}
      {/* use clickway, hoohk react que detecta clique fora o item em referencia */}

      {/* m,enu de chat, feedback e nota */}
      {/* serviços google analytics e outros */}
      <div className="flex flex-row justify-between items-end gap-2 flex-grow">
        <div className="md:max-w-[calc(50dvw-7.0621rem)] xl:max-w-[calc(40dvw-13.0621rem)] flex flex-col justify-between items-start gap-2 flex-grow">
          

           <div
            className=" flex-grow flex-shrink text-lg text-white flex flex-row items-center justify-between content-center align-center gap-1 cursor-pointer"
              onClick={handleCopy}
          >
            {/* <p className="text-blue-700 text-white underline cursor-pointer text-lg truncate max-w-150"> */}
            <p className="flex-grow flex-shrink text-white underline cursor-pointer line-clamp-3 text-lg max-w-150 break-all text-ellipsis">
              {link.url}
            </p>

            <SquareIcon
              icon="fa-solid fa-copy"
              className={`text-white text-lg cursor-pointer ${
                copied ? "text-green-400" : ""
              }`}
              title={copied ? "Copiado!" : "Copiar link"}
            />
            {copied && (
              <span className="ml-2 text-green-400 text-xs">Copiado!</span>
            )}
          </div>

            {/* css container + clamp + uselayouteffect + flexbasis (resize observer e offset top + calc) */}
            <p className="text-white flex-grow flex-shrink basis-auto text-md line-clamp-5 break-words text-ellipsis">
              {link.description ? (
                link.description
              ) : (
                "..."
                // <i className="fa-solid fa-ellipsis text-white text-md"></i>
              )}
            </p>

        </div>

        {/* quando for pra web fazer login pra receber favorito de outras pessoas, area privada e area publica por perfil */}

        <SquareIcon
          icon="fa-solid fa-file-pen"
          className="text-white text-2xl cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => onEditClick(link)}
          title="Editar link"
        />
      </div>
    </div>
  );
}

const MemoizedLinkCard = React.memo(LinkCard);

function UrlItem({ saveUrlRef, onEditClick, onShowAlert, onShowConfirmation }) {

  // Estado para armazenar tanto a query quanto o critério único
  const [searchParams, setSearchParams] = React.useState({
    query: '',
    criterion: 'link' // Critério padrão
});

  // Função que recebe os dados do componente SearchBar
  // Usamos React.useCallback para memoizar a função handleSearch.
  // Isso evita que uma nova função seja criada a cada renderização de UrlItem,
  // o que por sua vez impede que o useEffect dentro de SearchBar seja acionado desnecessariamente.
  const handleSearch = React.useCallback((params) => {
    setSearchParams(params);
    console.log("Filtros atualizados:", params);
  }, []); // O array de dependências está vazio porque setSearchParams é estável.

 const {
    links,
    deleteLink,
    toggleFavorite,
    incrementShare,
    updateFavoriteCount,
    incrementAccess,
    incrementCopy,
    removeTagFromLink,
    clearLinkUpdateFlag, // <-- Pega a nova função do contexto
  } = React.useContext(LinksContext);

  // Obtém todas as tags únicas dos links para usar nas sugestões.
  // Esta lógica DEVE vir DEPOIS de obter 'links' do contexto.
  const availableTags = React.useMemo(() => {
    if (!links) return [];
    const tags = new Set(links.flatMap(link => link.tags || []));
    return Array.from(tags);
  }, [links]);

  const [isLoading, setIsLoading] = React.useState(true);
  const prevLinksCount = React.useRef(undefined);

  // Loading no preload inicial e nas transições de 0<->1
  React.useEffect(() => {
    // Preload inicial: links indefinido/null
    if (links === undefined || links === null) {
      setIsLoading(true);
      return;
    }
    // Adicionou o primeiro item
    if (prevLinksCount.current === 0 && links.length === 1) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
    // Removeu o último item
    else if (prevLinksCount.current === 1 && links.length === 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
    // Carregamento inicial (primeira vinda dos dados)
    else if (prevLinksCount.current === undefined) {
      setIsLoading(false);
    }
    prevLinksCount.current = links.length;
  }, [links]);

  const LoadingSpinner = () => (
    <section className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600 text-sm font-medium">
            Carregando links...
          </p>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
        </div>
    </section>
  );

  const EmptyState = () => {
    const handleAddFirstLink = () => {
      if (saveUrlRef && saveUrlRef.current) {
        saveUrlRef.current.focusInput();
      }
    };
    return (
      <section className="flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-center relative">
            <i className="fa-solid fa-bookmark text-6xl text-gray-300 animate-pulse"></i>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-700">
              Nenhum <span className="underline">Link</span> salvo ainda
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Comece adicionando seus primeiros! Use o formulário acima para
              salvar links importantes. Acesso rápido clicando no botão abaixo.
            </p>
          </div>
          <button
            onClick={handleAddFirstLink}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200 hover:scale-105 transform"
          >
            <i className="fa-solid fa-arrow-up"></i>
            <span>Adicione seu primeiro</span>
          </button>
      </section>
    );
  };

  const handleToggleFavorite = React.useCallback(
    (id, currentStatus) => {
      toggleFavorite(id, currentStatus);
      updateFavoriteCount(id, !currentStatus); // !currentStatus = novo estado
    },
    [toggleFavorite, updateFavoriteCount]
  );

  const handleDeleteRequest = React.useCallback((linkToDelete) => {
    onShowConfirmation({
      title: "Confirmar Exclusão",
      text: `Tem certeza que deseja excluir o link "${linkToDelete.url}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        deleteLink(linkToDelete.id);
        onShowConfirmation(null); // Fecha o modal de confirmação
      }
    });
  }, [deleteLink, onShowConfirmation]);

  // Usamos React.useMemo para memoizar a lista de links filtrada.
  // A filtragem só será re-executada se `links` ou `searchParams` mudarem.
  // Isso é crucial para a performance, evitando re-cálculos em cada renderização.
  const filteredLinks = React.useMemo(() => {
    if (!links) return [];

    const query = searchParams.query.toLowerCase().trim();
    if (!query) {
      return links; // Se não há busca, retorna todos os links
    }

    return links.filter(link => {
      const { criterion } = searchParams;

      switch (criterion) {
        case 'link':
          // Permite buscar por múltiplos termos na URL, separados por vírgula
          const searchLinkTerms = query.split(',').map(t => t.trim()).filter(Boolean);
          if (searchLinkTerms.length === 0) return false;
          // Verifica se a URL do link inclui ALGUM dos termos pesquisados
          return searchLinkTerms.some(term => link.url.toLowerCase().includes(term));
        case 'description':
          // Permite buscar por múltiplos termos na descrição, separados por vírgula
          const searchDescTerms = query.split(',').map(t => t.trim()).filter(Boolean);
          if (searchDescTerms.length === 0) return false;
          // Verifica se a descrição do link inclui ALGUM dos termos pesquisados
          return searchDescTerms.some(term => link.description?.toLowerCase().includes(term));
        case 'tag':
          // Permite buscar por múltiplas tags separadas por vírgula
          const searchTags = query.split(',').map(t => t.trim()).filter(Boolean);
          if (searchTags.length === 0) return false;
          // Verifica se ALGUMA tag do link (linkTag) inclui ALGUM dos termos pesquisados (searchTag)
          return link.tags?.some(linkTag => searchTags.some(searchTag => linkTag.toLowerCase().includes(searchTag)));
        default:
          return true;
      }
    });
  }, [links, searchParams]); // Dependências do useMemo






  // Variável para saber se a busca não retornou resultados
  const hasNoResults = filteredLinks.length === 0 && searchParams.query.length > 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!links || links.length === 0) {
    return <EmptyState />;
  }

  // Componente para quando a busca não encontra resultados
  const NoResults = () => (
    <div className="w-full text-center animate-fade-in">
      <i className="fa-solid fa-search text-4xl text-gray-400 mb-4"></i>
      <h3 className="text-lg font-semibold text-gray-700">Nenhum resultado encontrado</h3>
      <p className="text-sm text-gray-500">
        Tente ajustar seus termos de busca para o critério de{' '}
        <span className="font-bold">{searchParams.criterion}</span> ou limpe a busca para ver
        todos os links.
      </p>
    </div>
  );

  return (
    <section className="flex flex-col items-start justify-start content-between align-center gap-4 dark:text-gray-200 flex-grow">
       <div className="flex flex-row items-center content-center align-center justify-between gap-4 w-full box-shadow-md">
        <h2 className="text-xl font-bold">Links salvos</h2>
        <div className="flex flex-row items-center content-center align-center justify-center gap-2">
          <LinkCounter />
          {/* <i className="fa-solid fa-filter"></i>
          <i className="fa-solid fa-plus"></i> */}
        </div>
      </div>

      <div className="w-full">
       <SearchBar onSearch={handleSearch} hasError={hasNoResults} availableTags={availableTags} />
        {/* Dica contextual para busca múltipla */}
        {searchParams.query && (
          <p className="text-xs text-gray-500 mt-1 text-center animate-fade-in">
            Para buscar múltiplos {searchParams.criterion === 'tag' ? 'tags' : 'termos'}, separe-os por vírgula.
          </p>
        )}
      </div>

      {/* <div className="w-full flex flex-row items-center justify-end">
        <i className="fa-solid fa-a"></i>
      </div> */}

      <div className="flex flex-row flex-wrap justify-start items-stretch gap-2 w-full">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
          <MemoizedLinkCard
            key={link.id} // A key está aqui, corretamente identificando cada card
            link={link}
            onToggleFavorite={handleToggleFavorite} // Passando o callback memoizado
            deleteLink={handleDeleteRequest} // Passando o handler que abre o modal
            incrementShare={incrementShare}
            incrementAccess={incrementAccess}
            incrementCopy={incrementCopy}
            removeTagFromLink={removeTagFromLink}
            clearLinkUpdateFlag={clearLinkUpdateFlag} // <-- Passa a função para o card
            onShowAlert={onShowAlert}
            onEditClick={onEditClick}
          />
          ))
        ) : (
          <NoResults />
        )}
      </div>
    </section>
    );
}
