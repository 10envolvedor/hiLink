function WelcomeMessage () {
    const [isVisible, setIsVisible] = React.useState(false);
    const [dontShowAgain, setDontShowAgain] = React.useState(false);
    const modalContentRef = React.useRef(null); // Ref para o conteúdo do modal

    React.useEffect(() => {
        // Verifica no localStorage se a mensagem já foi marcada para não ser exibida novamente.
        const hasSeen = localStorage.getItem('hasSeenWelcomeMessage');
        if (hasSeen !== 'true') {
            setIsVisible(true);
        }
    }, []); // Roda apenas uma vez, quando o componente é montado.

    const handleClose = () => {
        // Se o usuário marcou a caixa, salva a preferência no localStorage.
        if (dontShowAgain) {
            localStorage.setItem('hasSeenWelcomeMessage', 'true');
        }
        // Esconde a mensagem.
        setIsVisible(false);
    };

    // Efeito para travar o scroll do fundo e fechar ao clicar fora
    React.useEffect(() => {
        if (!isVisible) return;

        // Trava o scroll do elemento <html> para ser mais efetivo em todos os navegadores
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        function handleClickOutside(event) {
            // Se o ref existe e o clique não foi dentro dele, fecha o modal
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                handleClose();
            }
        }

        // Adiciona o listener
        document.addEventListener("mousedown", handleClickOutside);
        
        // Função de limpeza: restaura o scroll e remove o listener
        return () => {
            document.documentElement.style.overflow = originalOverflow;
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isVisible]); // A dependência garante que o efeito rode quando o modal aparece/desaparece

    // Se não for para ser visível, não renderiza nada.
    if (!isVisible) {
        return null;
    }

    // O JSX do modal que será renderizado no portal
    const modalJSX = (
      // Usamos um overlay para dar a aparência de um modal
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        {/* Container do conteúdo do modal com o ref */}
       <div ref={modalContentRef} className="font-sans leading-relaxed overflow-hidden max-w-xl w-full mx-auto my-5 bg-slate-50 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          
          {/* Header do Modal: Fixo, com título e botão de fechar */}
          <header className="relative flex items-center justify-center p-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-slate-900 text-xl font-bold text-center">Seja bem-vindo(a) ao hiLink! 👋</h2>
            <button onClick={handleClose} className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors">
              <SquareIcon icon="fa-solid fa-xmark" className="fa-lg" />
            </button>
          </header>

          {/* Área de conteúdo com rolagem interna */}
          <div className="p-6 overflow-y-auto flex-grow">
            <p className="mb-4">
              Tenho uma ótima notícia para te dar: seus dados são <strong className="text-slate-800">seus e só seus</strong>!
            </p>
            <p className="mb-4">
              Seus links aqui são salvos <strong className="text-slate-800">direto no seu dispositivo, usando tecnologias do próprio navegador</strong>. Isso significa que eles ficam no seu aparelho, sem passar por servidores nossos. <strong className="text-green-600">Não registramos nenhum dado pessoal seu.</strong> É <strong className="text-green-600">super seguro</strong>! Sem login pra começar, a proteção mora na segurança do seu próprio navegador e máquina!
            </p>
      
            <hr className="my-6 border-t border-slate-200" />
      
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Entenda o fluxo dos seus dados:</h3>
            <p className="mb-4">
              O hiLink não tem sincronização automática. Seus links são como um "exclusivo" daquele navegador onde você os criou.
            </p>
           <ul className="list-disc ml-5 mb-4 space-y-1">
              <li>Para <strong className="text-slate-800">transitar entre navegadores ou dispositivos</strong>, você usa as funções de <strong className="text-blue-600">Backup</strong> e <strong className="text-blue-600">Restaurar</strong>. O backup é feito <strong className="text-slate-800">via Google Drive</strong>, e você faz login exclusivamente para salvar seus dados lá. Depois, é só restaurar no novo ambiente.</li>
            </ul>
            <p className="mb-4">
              <strong className="text-slate-800">A dica de ouro:</strong> Para garantir que você <strong className="text-red-600">não perca nenhum link importante</strong>, <strong className="text-blue-600">faça sempre backup</strong> e, de preferência, <strong className="text-blue-600">use o mesmo navegador quando possível</strong>.
            </p>
      
            <p className="text-sm text-slate-600 mt-4">
              <i className="fa-solid fa-cookie-bite mr-2 text-blue-500"></i>Para melhorar sua experiência, usamos essas tecnologias de armazenamento local para guardar suas preferências como a opção de abrir ou não novamente essa mensagem.
               {/* modo claro/escuro. */}
            </p>
    
            <p className="text-center mt-6 text-sm text-slate-500">Bora organizar esses links essenciais?</p>
          </div>

          {/* Rodapé do modal, fixo na parte inferior */}
          <div className="mt-auto p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-lg">
            <label className="flex items-center text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Não mostrar esta mensagem novamente
            </label>
            <button 
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Bora! ✨
            </button>
          </div>
        </div>
      </div>
    );

    // Usa um portal para renderizar o modal no body, evitando problemas de z-index
    return ReactDOM.createPortal(modalJSX, document.body);
  }