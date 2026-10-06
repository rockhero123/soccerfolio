import SoccerField from "@/components/SoccerField";

// Temporary placeholder. The real page sections are built in SOC-7 (spec 001 US-6).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <SoccerField>
        <div className="mx-auto max-w-md rounded-card border-outline border-ink bg-mint p-6 text-center">
          <h1 className="font-heading text-4xl text-ink">Ricardo Martinez</h1>
          <p className="mt-2 font-body text-lg text-ink">
            Soccerfolio is warming up. Kick-off soon!
          </p>
        </div>
      </SoccerField>
    </main>
  );
}
