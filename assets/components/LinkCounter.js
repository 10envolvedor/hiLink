// arquivos poderiam ser nomeados depois né? criados e com o tempo nomeados, fica temporariamente salvo em disco com nome aleatorio
function LinkCounter() {
  // 1. Pega o contexto
  const { links } = React.useContext(LinksContext);

  // 2. Valida se existem links para renderizar o conteúdo
  if (!links || links.length === 0) {
    return <></>;
  }

  // 3. Usa o dado do contexto para renderizar a informação
  return (
    // <p className="text-sm text-gray-500 mr-4">
    <p className="text-sm text-gray-500">
      {links.length} {links.length > 1 ? 'registros' : 'registro'}
    </p>
  );
}
