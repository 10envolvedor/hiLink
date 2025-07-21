// permite uso de posicionamento virtual
function TooltipExample({ button, children, offset = 12 }) {
  // Como não temos 'import', pegamos o hook do objeto global ReactPopper
  const { usePopper } = ReactPopper;

  // Estado para controlar a visibilidade do tooltip
  const [visible, setVisible] = React.useState(false);

  // Refs para os elementos que queremos posicionar
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);

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

  const showTooltip = () => setVisible(true);
  const toogleTooltip = () => setVisible(!visible);
  const hideTooltip = () => setVisible(false);

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
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
            className="bg-black text-white px-3 py-1.5 rounded-md text-sm shadow-lg flex flex-col items-center content-center align-center justify-center gap-2"
          >
            {children}
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
