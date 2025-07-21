function SquareIcon({ icon, className, onClick, typeCursor = "pointer", title }) {
  return (
    <i
      className={`${icon} w-fit h-fit m-1 ${className}`}
      onClick={onClick}
      title={title}
      style={{
        aspectRatio: "1 / 1",
        minWidth: "1em",
        minHeight: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        WebkitUserSelect: "none", // Adicionado para resolver o problema no Safari
        cursor: typeCursor
      }}
    ></i>
  );
}
