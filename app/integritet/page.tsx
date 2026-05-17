export const metadata = {
  title: "Integritetspolicy | FreeWebDev",
  description:
    "Hur vi hanterar personuppgifter, chat, förfrågningar och inloggning på FreeWebDev.",
};

export default function IntegritetPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-slate dark:prose-invert">
      <h1>Integritetspolicy</h1>
      <p className="lead text-slate-600 dark:text-slate-400">
        Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
      </p>

      <h2>Vem ansvarar?</h2>
      <p>
        FreeWebDev (&quot;vi&quot;) driver denna portfolio och erbjuder gratis
        hemsidor. Kontakt: via chatten på webbplatsen eller e-post som anges på
        Om mig-sidan.
      </p>

      <h2>Vilka uppgifter samlar vi in?</h2>
      <ul>
        <li>
          <strong>Inloggning (Clerk):</strong> namn, e-post och profilbild när du
          loggar in för att chatta.
        </li>
        <li>
          <strong>Live-chatt:</strong> meddelanden och eventuella bilagor du
          skickar.
        </li>
        <li>
          <strong>Förfrågan om hemsida:</strong> namn, e-post, beskrivning av
          projekt och övriga uppgifter i formuläret.
        </li>
        <li>
          <strong>Teknisk data:</strong> webbläsare, IP (via hosting/leverantörer)
          i enlighet med deras policyer.
        </li>
      </ul>

      <h2>Hur använder vi uppgifterna?</h2>
      <ul>
        <li>För att svara på chatt och förfrågningar.</li>
        <li>För att administrera och leverera gratis hemsidor.</li>
        <li>För att skicka e-postnotiser till administratör vid nya meddelanden.</li>
      </ul>

      <h2>Lagring</h2>
      <p>
        Data lagras i Convex (backend) och Clerk (autentisering). Chattbilagor
        lagras i Convex fil-lagring. Meddelanden kan rensas automatiskt efter 24
        timmar enligt vår underhållsrutin.
      </p>

      <h2>Delning med tredje part</h2>
      <ul>
        <li>Clerk — inloggning</li>
        <li>Convex — databas och chat</li>
        <li>Resend — e-post till administratör (vid konfigurerad API-nyckel)</li>
        <li>Vercel/hosting — drift av webbplatsen</li>
      </ul>
      <p>Vi säljer inte dina personuppgifter.</p>

      <h2>Dina rättigheter (GDPR)</h2>
      <p>
        Du kan begära tillgång, rättelse eller radering av dina uppgifter genom
        att kontakta oss. Du kan när som helst sluta använda chatten och begära
        att konversation raderas.
      </p>

      <h2>Notiser och ljud</h2>
      <p>
        Om du godkänner webbläsarnotiser kan du få desktop-meddelanden vid nya
        svar. Detta är frivilligt och kan stängas av i webbläsaren.
      </p>

      <h2>Cookies</h2>
      <p>
        Vi använder nödvändiga cookies/sessioner för inloggning via Clerk. Inga
        marknadsföringscookies körs av oss i grundläget.
      </p>
    </div>
  );
}
