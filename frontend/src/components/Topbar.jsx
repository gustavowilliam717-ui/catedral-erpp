import { useState } from "react";

export default function Topbar() {
  const [openMenu, setOpenMenu] = useState(null);

  function toggle(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  return (
    <header className="topbar-premium">

      <div className="topbar-left">
        <button onClick={() => toggle("apps")}>▦ Apps</button>
        <button onClick={() => toggle("help")}>❓ Ajuda</button>
      </div>

      <div className="topbar-right">
        <button onClick={() => toggle("notifications")}>🔔</button>
        <button onClick={() => toggle("settings")}>⚙️</button>

        <button
          className="user-button"
          onClick={() => toggle("user")}
        >
          🛡 Gustavo ▼
        </button>
      </div>

    </header>
  );
}
