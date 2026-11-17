import { Suspense, type ReactNode } from "react";
import { LocaleDocument } from "@/components/locale-document";
import { getLocaleDictionary } from "@/lib/i18n/locale";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type RenderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type Props = {
  fallback: ReactNode;
  children: (props: RenderProps) => ReactNode;
};

async function LocaleResolved({ children }: Omit<Props, "fallback">) {
  const { locale, dictionary } = await getLocaleDictionary();
  return (
    <>
      <LocaleDocument locale={locale} />
      {children({ locale, dictionary })}
    </>
  );
}

export function LocaleGate({ fallback, children }: Props) {
  return (
    <Suspense fallback={fallback}>
      <LocaleResolved>{children}</LocaleResolved>
    </Suspense>
  );
}
