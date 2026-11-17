import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getTheme } from "@/lib/theme/cookie";

type Props = {
  label: string;
  darkLabel: string;
  lightLabel: string;
};

function ThemeSwitcherFallback({
  label,
  darkLabel,
  lightLabel,
}: Props) {
  return (
    <ThemeSwitcher
      label={label}
      darkLabel={darkLabel}
      lightLabel={lightLabel}
    />
  );
}

async function ThemeSwitcherResolved(props: Props) {
  const initialTheme = await getTheme();
  return <ThemeSwitcher {...props} initialTheme={initialTheme} />;
}

/** Own Suspense hole so theme cookies don't bubble into LocaleGate. */
export function ThemeSwitcherGate(props: Props) {
  return (
    <Suspense fallback={<ThemeSwitcherFallback {...props} />}>
      <ThemeSwitcherResolved {...props} />
    </Suspense>
  );
}
