import CalculatorContainer from '@/components/CalculatorContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary font-headline mb-2">
            PV-Netzanschlussvergleich
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vergleichen Sie Niederspannungs- (NS) und Mittelspannungs- (MS) Netzanschlussszenarien für Photovoltaik-Projekte basierend auf technischer Auslegung und wirtschaftlichen Annahmen.
          </p>
        </header>
        
        <CalculatorContainer />
        
        <footer className="mt-12 py-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PV-Netzanschlussvergleich. Nur für vorläufige technische Schätzungen.</p>
        </footer>
      </div>
    </main>
  );
}
