// fazer barra de busca que possa encontrar tags e etc
// outros icones do font awesome como por exemplo file e etc
const SaveUrl = React.forwardRef((props, ref) => {
  const { onShowAlert } = props
  // adicionar botão de fala por voz
  const { addLink, links } = React.useContext(LinksContext);
  const [urlValue, setUrlValue] = React.useState("");
  const [inputError, setInputError] = React.useState(false);

  const inputRef = React.useRef(null);

  // Estado para mostrar o ícone de paste
  const [canPaste, setCanPaste] = React.useState(false);
  const [clipboardUrl, setClipboardUrl] = React.useState("");

  // Regex simples para validar links
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

  // Função para checar clipboard
  const checkClipboard = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        const text = await navigator.clipboard.readText();
        if (isValidUrl(text)) {
          setCanPaste(true);
          setClipboardUrl(text);
        } else {
          setCanPaste(false);
          setClipboardUrl("");
        }
      } catch {
        setCanPaste(false);
        setClipboardUrl("");
      }
    } else {
      setCanPaste(false);
      setClipboardUrl("");
    }
  };

  // Checagem automática do clipboard a cada 1 segundo
  React.useEffect(() => {
    const interval = setInterval(() => {
      checkClipboard();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debug: monitorar quando o input perde o foco
  const handleInputBlur = () => {
    if (inputError) setInputError(false);
  };

  // Debug: monitorar quando o input ganha o foco

  // Função para colar o link no input
  const handlePasteClick = async () => {
    let text = "";
    if (navigator.clipboard && window.isSecureContext) {
      try {
        text = await navigator.clipboard.readText();
        console.log("Clipboard lido no clique:", text);
      } catch (e) {
        console.warn("Erro ao ler clipboard no clique:", e);
      }
    }
    if (!text && clipboardUrl) {
      text = clipboardUrl;
      console.log("Usando clipboardUrl armazenado:", text);
    }
    if (isValidUrl(text)) {
      setUrlValue(text);
      if (inputRef.current) inputRef.current.focus();
    } else {
      onShowAlert?.({
        title: "Link Inválido",
        text: "Não foi possível colar: o conteúdo da área de transferência não é um link válido (http/https). Copie um link e tente novamente.",
      });
    }
  };

  const clearUrl = () => {
    setUrlValue("");
  };

  // Função para lidar com a adição de um novo link
  const handleAddLink = (e) => {
    if (e) e.preventDefault();
    if (!urlValue || !isValidUrl(urlValue)) {
      setInputError(true);
      onShowAlert?.({
        title: "URL Inválida",
        text: "Por favor, insira uma URL válida antes de salvar.",
      });
      return;
    }
    setInputError(false);
    const newLink = {
      url: urlValue,
      description: null,
      tags: null,
      isFavorited: false,
      sharedCount: 0,
      accessedCount: 0,
      copiedCount: 0,
    };
    addLink(newLink)
      .then(() => {
        setUrlValue("");
      })
      .catch((error) => {
        console.warn(
          "Erro ao adicionar link (provavelmente URL duplicada):",
          error
        );
        onShowAlert?.({
          title: "Erro ao Salvar",
          text: "Não foi possível adicionar o link. A URL já pode existir.",
        }, 5000);
      });
  };

  // Função para dar focus no input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  React.useImperativeHandle(ref, () => ({
    focusInput,
    setUrl: (value) => setUrlValue(value),
    clearUrl: () => setUrlValue(""),
  }));

  return (
    // nao valida a regex quando salva pelo botao
    <section className="gap-4">
      <form
        onSubmit={handleAddLink}
        className="flex flex-col items-start justify-between w-full"
        autoComplete="off"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-2 md:gap-4">
          <div className="flex flex-col items-start w-full md:w-1/2">
            <label htmlFor="urlInput" className="text-left">
              Url:
              {props.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative w-full flex items-center text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fa-solid fa-link"></i>
              </div>
              <input
                ref={inputRef}
                id="urlInput"
                type="text"
                placeholder="ex: https://theoficialhub.com"
                pattern="https?://.+\..+"
                title="Include http://"
                className={`p-2 pl-10 pr-12 w-full ring ring-gray-300 rounded-md border border-transparent ring-opacity-50 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 placeholder:text-gray-400 ${
                  inputError ? "border-red-500 ring-red-400" : ""
                }`}
                required
                name="url"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  if (inputError) setInputError(false);
                }}
                onBlur={handleInputBlur}
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {urlValue && (
                  <SquareIcon
                    icon="fa-solid fa-trash-can"
                    onClick={clearUrl}
                    title="Limpar campo de URL"
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                )}
                {canPaste && !urlValue && (
                  <SquareIcon
                    icon="fa-solid fa-paste"
                    onClick={handlePasteClick}
                    title="Colar link da área de transferência"
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                )}
              </div>
            </div>
          </div>

            {/* Mensagem de erro agora aparece após a div pai do input */}
        {inputError && (
          <span className="flex flex-col items-start block md:hidden w-full text-red-500 text-xs mt-1">
            Insira uma URL válida para salvar.
          </span>
        )}

          <div className="flex flex-col items-center w-full md:w-1/2 gap-1 md:gap-4">
            <p className="self-start md:self-center md:block">Salvamento</p>

            <div className="flex flex-row w-full">
              {/* on haserror block to */}
              {/* adiconar cursor block enquanto não tiver anda salvo no input */}
              <Button
                className="order-2 md:order-1 flex flex-grow items-center content-center align-center justify-center py-2 px-4 gap-2"
                onClick={handleAddLink}
              >
                Rápido <SquareIcon icon="fa-solid fa-plus" />
              </Button>

              <button
                type="button"
                className="order-1 md:order-2 flex flex-grow items-center justify-center bg-black hover:bg-dark-700 text-white py-2 px-4 rounded gap-2"
                onClick={() => {
                  if (!urlValue || !isValidUrl(urlValue)) {
                    setInputError(true);
                    props.onShowAlert?.({
                      title: "URL Inválida",
                      text: "Por favor, insira uma URL válida antes de abrir o modo detalhado.",
                    });
                    return;
                  }
                  // Validação para checar se o link já existe ANTES de abrir o modal
                  const linkExists = links?.some(
                    (link) => link.url === urlValue
                  );
                  if (linkExists || linkExists === 0) {
                    props.onShowAlert?.({
                      title: "Link já existe",
                      text: "Este link já foi salvo. Você pode editá-lo na lista abaixo.",
                    });
                    return;
                  }

                  props.onDetalhadoClick?.(urlValue);
                }}
              >
                Detalhado <i className="fa-solid fa-list"></i>
              </button>
            </div>
          </div>

        
        </div>

          {/* Mensagem de erro agora aparece após a div pai do input */}
        {inputError && (
          <span className="flex flex-col items-start w-full hidden md:block order-2 md:order-3 text-red-500 text-xs mt-1">
            Insira uma URL válida para salvar.
          </span>
        )}
      </form>
    </section>
  );
});
