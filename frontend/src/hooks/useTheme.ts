import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(
    localStorage.getItem("mediscan_theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("mediscan_theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, setDark };
}
