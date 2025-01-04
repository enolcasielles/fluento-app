import { Button } from "@/core/components/base/button";
import { ArrowRight, Mic, Brain, ListChecks } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aprende inglés de forma natural y efectiva
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Practica traducción inversa con IA y mejora tu fluidez en el
              idioma
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Comenzar ahora <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-blue-600" />}
              title="Práctica con voz"
              description="Mejora tu fluidez practicando traducción inversa mediante ejercicios de voz"
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-blue-600" />}
              title="IA Adaptativa"
              description="Algoritmo inteligente que se adapta a tu nivel y refuerza tus áreas débiles"
            />
            <FeatureCard
              icon={<ListChecks className="w-8 h-8 text-blue-600" />}
              title="Listas personalizadas"
              description="Accede a listas temáticas o crea las tuyas propias con contenido personalizado"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Comienza tu viaje hacia la fluidez en inglés
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a nuestra comunidad y mejora tu inglés de forma efectiva
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="outline">
              Versión gratuita
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Prueba Premium
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
