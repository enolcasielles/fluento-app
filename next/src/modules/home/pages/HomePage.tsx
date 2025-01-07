import { Clock } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <Clock className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Próximamente
            </h1>
            <p className="text-xl text-gray-600">
              Estamos preparando una nueva forma de aprender inglés. Una
              experiencia de aprendizaje natural y efectiva que te ayudará a
              alcanzar la fluidez que siempre has deseado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
