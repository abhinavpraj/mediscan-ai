import { Dashboard } from "./components/Dashboard";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { dark, setDark } = useTheme();

  return <Dashboard dark={dark} setDark={setDark} />;
}
