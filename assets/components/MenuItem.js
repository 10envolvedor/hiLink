function MenuItem({icon, text}) {
  return (
    <li className="flex flex-col items-center content-center align-center justify-center gap-2">
      <i className={icon}></i>
      <span>{text}</span>
    </li>
  );
}