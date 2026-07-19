import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { SAFETY_CONTACTS } from "@/lib/safetyContacts";

// S11「安心して使うために」の静的UI試作(設計書§20)。
// 相談窓口の電話番号は lib/safetyContacts.ts の注記のとおり未記載(公開前に要確認)。
export default function SafetyPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center gap-8 bg-[#FAF6EF] px-6 py-16 font-serif text-[#4a4a4a]">
      <h1 className="text-center text-lg">{ja.safety.heading}</h1>

      <p className="max-w-sm text-center text-sm leading-relaxed">{ja.safety.disclaimer}</p>

      <section className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[#e5ddd0] bg-white p-5">
        <p className="text-sm">{ja.safety.contactsHeading}</p>
        <ul className="flex flex-col gap-2">
          {SAFETY_CONTACTS.map((contact) => (
            <li key={contact.name} className="text-sm">
              <span className="font-medium">{contact.name}</span>
              <span className="ml-2 text-[#a8a8a8]">
                {contact.number ?? "(電話番号:確認中)"}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-[#a8a8a8]">{ja.safety.contactsNotice}</p>
      </section>

      <section className="flex w-full max-w-sm flex-col gap-2 text-center">
        <p className="text-sm text-[#7a7a7a]">{ja.safety.privacyHeading}</p>
        <p className="text-[11px] text-[#a8a8a8]">{ja.safety.privacyNotice}</p>
      </section>

      <Button variant="text" href="/">
        {ja.safety.backLink}
      </Button>
    </main>
  );
}
