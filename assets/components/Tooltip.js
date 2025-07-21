// permite uso de posicionamento virtual
function Tooltip({ button, children, offset = 12, onAction }) {
  // Como não temos 'import', pegamos o hook do objeto global ReactPopper
  const { usePopper } = ReactPopper;

  // Estado para controlar a visibilidade do tooltip
  const [visible, setVisible] = React.useState(false);

  // Refs para os elementos que queremos posicionar
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);

  // Ref para armazenar a função de click outside
  const handleClickOutsideRef = React.useRef(null);

  // O coração da biblioteca: o hook usePopper
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "auto", // Queremos que o tooltip apareça em cima
      strategy: "absolute",
      modifiers: [
        { name: "arrow", options: { element: arrowElement } },
        {
          name: "offset",
          options: {
            offset: [0, offset], // [distância horizontal, distância vertical]
          },
        },
      ],
    }
  );

  // --- LÓGICA REFINADA COM TERNÁRIO INLINE ---
  const arrowStyles = {
    // 1. Copia todos os estilos base da seta (top, left, etc.)
    ...styles.arrow,
    // 2. Aplica a lógica de transformação de forma condicional
    transform: styles.arrow.transform?.includes("rotate")
      ? styles.arrow.transform // SE VERDADEIRO: usa o transform original, pois já tem 'rotate'
      : `${styles.arrow.transform || ""} rotate(45deg)`.trim(), // SE FALSO: concatena o rotate
  };
  // --- FIM DA LÓGICA REFINADA ---

  // Função para fechar o tooltip
  const closeTooltip = () => setVisible(false);

  const toogleTooltip = () => {
    setVisible(!visible);
    // Se estiver fechando, remove o event listener imediatamente
    if (visible && handleClickOutsideRef.current) {
      document.removeEventListener("mousedown", handleClickOutsideRef.current);
    }
  };

  // Função para executar ação e fechar o portal
  const handleAction = (event) => {
    // Se existe uma função onAction, executa ela
    if (onAction) {
      onAction(event);
    }
    // Fecha o portal após a ação
    closeTooltip();
    // Remove o event listener imediatamente
    if (handleClickOutsideRef.current) {
      document.removeEventListener("mousedown", handleClickOutsideRef.current);
    }
  };

    // Effect para detectar cliques fora do portal
  React.useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event) => {
      // Verifica se o clique foi fora do botão de referência e fora do portal
      if (
        referenceElement && 
        !referenceElement.contains(event.target) &&
        popperElement && 
        !popperElement.contains(event.target)
      ) {
        closeTooltip();
      }
    };

    // Armazena a função na ref para poder removê-la no toggle
    handleClickOutsideRef.current = handleClickOutside;

    // Adiciona o event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup: remove o event listener quando o componente for desmontado
    // ou quando o tooltip for fechado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, referenceElement, popperElement]);

  React.useEffect(() => {
    if (visible && update) {
      update();
    }
  }, [visible, update, referenceElement, popperElement, arrowElement]);

  return (
    <div className="w-fit h-fit flex-grow-0">
      {/* O elemento de referência */}
      <span
        type="button"
        ref={setReferenceElement}
        onMouseEnter={toogleTooltip}
        onMouseLeave={toogleTooltip}
        className="w-fit h-fit flex-grow-0"
      >
        {button}
      </span>

      {/* O elemento "popper" (nosso tooltip) */}
      {visible &&
        ReactDOM.createPortal(
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="bg-black text-white px-2 py-2 rounded-md text-sm shadow-lg flex flex-col items-center content-center align-center justify-center"
          >
            {/* Wrapper para interceptar cliques nas ações */}
            <div onClick={handleAction}>
              {children}
            </div>

            <div
              ref={setArrowElement}
              className="w-2 h-2 bg-black tooltip-arrow"
              style={arrowStyles}
              {...attributes.arrow}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
