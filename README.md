# Gratis Hemsida - Next.js App

En komplett webbapplikation där användare kan begära gratis hemsidor, chatta med admin, boka möten och donera frivilligt. Byggd med modern teknologi för bästa prestanda och användarupplevelse.

## ✨ Funktioner

- 📱 **Responsiv design** - Fungerar perfekt på mobil, tablet och desktop
- 💬 **Realtidschatt** - Chatta med admin med filöverföring
- 📅 **Mötesbokning** - Boka möten med admin via integrerat kalendersystem
- 📝 **Förfrågningar** - Begär gratis hemsida genom enkelt formulär
- 💝 **Donationer** - Stöd projektet via Swish, Revolut eller kortbetalning
- 🔐 **Adminpanel** - Fullständig hantering av chattar, möten, förfrågningar och blogg
- 📊 **Bulk actions** - Hantera flera förfrågningar samtidigt
- 📎 **Filuppladdning** - Skicka och ta emot filer i chatten
- 🌓 **Dark mode** - Automatiskt ljust/mörkt läge baserat på systeminställning

## 🛠️ Teknologier

- **Framework:** Next.js 16 (App Router)
- **Språk:** TypeScript
- **Backend:** Convex (Realtidsdatabas + Serverless Functions)
- **Autentisering:** Clerk
- **Styling:** Tailwind CSS
- **Ikoner:** React Icons
- **Betalning:** Stripe (kortbetalning), Swish, Revolut

## 🚀 Kom igång

### Förutsättningar

- Node.js 18+ eller 20+
- npm eller yarn
- Convex konto (gratis)
- Clerk konto (gratis)

### Installation

1. Klona repot
```bash
git clone https://github.com/hodhod22/gratis.git
cd gratis

Hur man startar projektet:
Fyll i dina egna API-nycklar i .env.local
Öppna två separata bash
Lägg din .env.local fil i Environment Variables i convex som ligger i Settings i convex
npx convex dev
npm run dev
Öppna http://localhost:3000

Projektstruktur
├── app/                    # Next.js App Router
│   ├── admin/             # Adminpanel med lazy loading
│   ├── book-meeting/      # Mötesbokning
│   ├── donate/            # Donationssida
│   └── request/           # Förfrågningsformulär
├── components/            # Återanvändbara komponenter
├── convex/                # Convex backend funktioner
│   ├── admin.ts          # Admin queries/mutations
│   ├── adminStatus.ts    # Admin online-status
│   ├── chat.ts           # Chattfunktioner
│   ├── meetings.ts       # Möteshantering
│   ├── requests.ts       # Förfrågningshantering
│   └── schema.ts         # Databasschema
├── lib/                   # Hjälpfiler och hooks
└── public/               # Statiska filer

För att få adminåtkomst, lägg till din e-postadress i ADMIN_EMAILS arrayen i:

convex/lib/auth.ts

convex/adminStatus.ts

const ADMIN_EMAILS = [
  "din.email@gmail.com",
];

Deploy på Vercel
Pusha ditt repo till GitHub

Importera projektet på Vercel

Lägg till miljövariabler i Vercel dashboard

Deploy!
npx convex deploy
📧 Kontakt
Har du frågor? Kontakta mig via:

Email: din.ezadkhahaali@gmail.com

GitHub Issues
⭐ Stjärnmärk gärna repot om du gillar projektet!


## 📁 **2. .env.example**

```bash
# .env.example - Kopiera denna fil till .env.local och fyll i dina värden

# Convex (https://dashboard.convex.dev)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk Authentication (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx

# Stripe (för kortbetalningar) - Valfritt
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin e-postadress (för utveckling, även hårdkodad i koden)
ADMIN_EMAIL=din.email@gmail.com
