// database.js
const dbName = "hiLink";

const db = new Dexie(dbName);

const dbVersion = 1;

// Define a versão e a estrutura das tabelas.
db.version(dbVersion).stores({
  /*
   * Tabela 'links':
   * '++id': Chave primária com auto-incremento. É o jeito mais fácil.
   * '&url':  O '&' indica que a URL deve ser única. Impede links duplicados.
   * 'isFavorited': Um índice simples para buscar favoritos rapidamente.
   * '*tags':    O '*' indica um "multi-entry index". Permite buscar por links
   * que contenham uma ou mais tags específicas de forma muito eficiente.
   */
  links:
    "++id, &url, description, *tags, isFavorited, accessCount, sharedCount, favoritedCount, copyCount",
});

// Nota: Para a sua estrutura sem 'import/export', a variável 'db' estará
// disponível globalmente nos scripts carregados depois deste.

const LinksContext = React.createContext(null);
