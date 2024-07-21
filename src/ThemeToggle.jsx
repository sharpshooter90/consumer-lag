import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log(`Switching to ${newTheme} theme`);
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 gap-4">
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="theme-toggle">Toggle Theme</Label>
    </div>
  );
}
