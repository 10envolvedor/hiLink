// --- Componente Auxiliar (movido para fora do SearchBar) ---
// Mover o RadioButton para fora do SearchBar evita que ele seja recriado a cada renderização.
// Isso melhora a performance e a clareza do código, tornando-o um componente mais puro.
const RadioButton = ({ criterion, icon, label, selectedCriterion, onSelect, className }) => {
  const isSelected = selectedCriterion === criterion;
  return (
    <button
      type="button"
      onClick={() => onSelect(criterion)}
      title={`Buscar por ${label}`}
      // As classes de estilo mudam para dar a aparência de um botão de rádio selecionado
      className={`${className}  
        flex items-center gap-2 px-4 py-2 border rounded-full
        transition-all duration-200 ease-in-out text-sm max-[320px]:justify-center
        ${isSelected 
          ? 'bg-blue-500 text-white border-blue-600 shadow-md font-semibold' 
          : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-gray-300'
        }
      `}
    >
      <i className={`fa-solid ${icon} w-4 text-center `}></i>
      <span>{label}</span>
    </button>
  );
};

function SearchBar({ onSearch, hasError, availableTags }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  // Novo estado para gerenciar o critério de busca único. 'link' começa selecionado.
  const [selectedCriterion, setSelectedCriterion] = React.useState('link');

  // Estado para controlar a visibilidade das sugestões. É aqui que declaramos a variável que faltava.
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Pega apenas a última parte da string (após a última vírgula) para gerar sugestões.
  // Movemos para fora do useMemo para poder reutilizar na lógica de renderização.
  const lastTagQuery = selectedCriterion === 'tag' 
    ? searchQuery.toLowerCase().split(',').pop().trim()
    : '';

  // Lógica para gerar e exibir sugestões de tags
  const suggestedTags = React.useMemo(() => {
    // As sugestões só aparecem se o critério for 'tag' e houver uma query para a última tag.
    if (selectedCriterion !== 'tag' || !availableTags || !lastTagQuery) {
      return [];
    }
    
    // Filtra as tags disponíveis que incluem o texto parcial que está sendo digitado.
    return availableTags.filter(tag => tag.toLowerCase().includes(lastTagQuery)).slice(0, 5);
  }, [searchQuery, selectedCriterion, availableTags, lastTagQuery]); // Adicionamos lastTagQuery aqui


  // Função para lidar com o clique em uma sugestão
  const handleSuggestionClick = (tag) => {
    const parts = searchQuery.split(',').map(t => t.trim()).filter(Boolean);
    if (parts.length > 0) {
      parts[parts.length - 1] = tag;
      setSearchQuery(parts.join(', ') + ', ');
    } else {
      setSearchQuery(tag + ', ');
    }
    // A linha abaixo foi removida.
    // A lista de sugestões agora se esconde naturalmente quando a busca parcial fica vazia (após a vírgula),
    // e reaparece assim que o usuário começa a digitar a próxima tag.
    // setShowSuggestions(false);
  };

  // Esta função é chamada sempre que o texto ou o critério de busca mudam.
  React.useEffect(() => {
      if (onSearch) {
      onSearch({ query: searchQuery, criterion: selectedCriterion });
    }
  }, [searchQuery, selectedCriterion, onSearch]);

  //   talvez quando adicionar novo item la no links ele tenha que atualizar aqui e refletir
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Função para limpar o campo de busca
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Função para selecionar um critério de busca.
  // Permanece aqui pois gerencia o estado interno do SearchBar.
  const selectCriterion = (criterion) => {
    setSelectedCriterion(criterion);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Pesquisa enviada:', { query: searchQuery, criterion: selectedCriterion });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto my-4 flex flex-col items-center"
    >
            {/* --- BARRA DE INPUT --- */}
      <div className="relative w-full flex items-center text-gray-400 focus-within:text-gray-600">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          name="search"
          placeholder="Pesquisar em seus links... (separados por vírgula)"
          value={searchQuery}
                    onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off"
          className={`
            w-full p-2 pl-12 pr-12 text-gray-700 bg-white border border-transparent
            rounded-md transition-all duration-300 ease-in-out 
            ring ring-gray-300 ring-opacity-50 shadow-sm 
            focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50
            placeholder:text-gray-400
            ${hasError ? "border-red-500 ring-red-400" : ""}
          `}
        />
        {/* --- SUGESTÕES DE TAGS --- */}
        {showSuggestions && suggestedTags.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {suggestedTags.map(tag => (
              <li
                key={tag}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault(); // Evita que o onBlur do input seja acionado antes do clique

                  handleSuggestionClick(tag);
                }}
              >
                {tag}
              </li>
            ))}

          </ul>
        )}
        {/* --- MENSAGEM DE NENHUMA TAG ENCONTRADA --- */}
        {/* A condição agora usa 'lastTagQuery' para ser mais precisa. */}
        {showSuggestions && suggestedTags.length === 0 && lastTagQuery && selectedCriterion === 'tag' && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <li className="px-4 py-2 text-gray-700">Nenhuma tag encontrada com esse nome.</li>
          </ul>
        )}

        {/* --- BOTÃO DE LIMPAR (aparece quando há texto) --- */}
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <SquareIcon
              icon="fa-solid fa-trash-can"
              onClick={clearSearch}
              title="Limpar busca"
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            />
          </div>
        )}
      </div>

      {/* --- BOTÕES DE FILTRO (RADIO) --- */}
      <div className="flex items-center max-sm:flex-col col mt-4 gap-2 max-[320px]:items-start max-[320px]:w-full">
        <span className="text-sm text-gray-500 mr-2">Buscar por:</span>
        <div className="flex flex-row gap-2 max-[320px]:flex-col max-[320px]:items-start max-[320px]:w-full">
        <RadioButton criterion="link" icon="fa-link" label="Link" selectedCriterion={selectedCriterion} onSelect={selectCriterion} className="max-[320px]:w-full" />
        <RadioButton criterion="description" icon="fa-align-left" label="Descrição" selectedCriterion={selectedCriterion} onSelect={selectCriterion} className="max-[320px]:w-full" />
        <RadioButton criterion="tag" icon="fa-tag" label="Tag" selectedCriterion={selectedCriterion} onSelect={selectCriterion} className="max-[320px]:w-full" />
        </div>
      </div>
    </form>
  );
}
