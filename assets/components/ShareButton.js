function ShareButton({ title, text, url, onSuccess }) {
    // 1. Verifica se a Web Share API está disponível no navegador
    const isShareSupported = !!navigator.share;
  
    // 2. A função que será chamada no clique do botão
    const handleShare = async () => {
      // Garante que a API existe antes de tentar usá-la
      if (navigator.share) {
        try {
          // 3. Monta o objeto com os dados que você quer compartilhar
          await navigator.share({
            title: title, // O título que aparecerá na janela de compartilhamento
            text: text,   // A mensagem principal que você quer divulgar
            url: url      // A URL do seu link ou da página específica
          });
        //   incrementa contados
          console.log("Conteúdo compartilhado com sucesso!");
          onSuccess()
        } catch (error) {
          // O usuário pode fechar a janela de compartilhamento, o que gera um erro.
          // Nós o capturamos para que não quebre a aplicação.
          console.error("Erro ao compartilhar:", error);
        }
      } else {
        // Fallback para navegadores que não suportam a API
        alert("A API de compartilhamento não é suportada neste navegador.");
      }
    };
  
    // 4. Só renderiza o botão se a API for suportada
    if (!isShareSupported) {
      return null; // Ou você pode renderizar um botão de fallback (veja abaixo)
    }
  
    return (
        <SquareIcon icon="fa-solid fa-share-nodes" className="text-2xl text-white" onClick={handleShare} title="Compartilhar" />
    );
  }