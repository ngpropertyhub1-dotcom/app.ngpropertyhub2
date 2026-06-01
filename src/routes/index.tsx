import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, DollarSign, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy to-navy-elevated">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-20 sm:py-32 text-white max-w-6xl mx-auto">
        <div className="space-y-6 mb-12">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-tight text-balance">
            The Future of Real Estate
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Verified listings, AI-powered valuations, and smart escrow — securely trade property across all 50 states.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="bg-gold-gradient text-gold-foreground hover:opacity-90">
              <Link to={user ? "/dashboard" : "/splash"}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-20 bg-navy/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-white text-center mb-16">Why Choose us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every property verified on blockchain" },
              { icon: DollarSign, title: "No Hidden Fees", desc: "Transparent pricing, zero surprises" },
              { icon: TrendingUp, title: "Smart Escrow", desc: "6-stage secure payment process" },
              { icon: Home, title: "50 States", desc: "Complete US market coverage" },
            ].map((f, i) => (
              <div key={i} className="text-white space-y-3">
                <f.icon className="h-12 w-12 text-gold" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-white/70 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
