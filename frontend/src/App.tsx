import { useState, useEffect } from "react"
import { Formulario, type ViagemData } from "./components/Formulario"
import { CardViagem } from "./components/CardViagem"
import Header from "./components/Header"
import { api } from "./services/api"

export default function App() {
  const [viagens, setViagens] = useState<ViagemData[]>([])
  const [busca, setBusca] = useState("")

  // NOVO: Estado para controlar qual viagem está sendo editada
  const [viagemParaEditar, setViagemParaEditar] = useState<ViagemData | null>(null)

  // Separei a busca em uma função para podermos chamar ela facilmente sempre que salvarmos ou editarmos algo
  const carregarViagens = async () => {
    try {
      const resposta = await api.get('/trips');
      setViagens(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar as viagens:", erro);
    }
  }

  useEffect(() => {
    carregarViagens();
  }, []);

  const deletarViagem = async (idParaDeletar: number) => {
    try {
      await api.delete(`/trips/${idParaDeletar}`);
      const novaLista = viagens.filter((viagem) => viagem.id !== idParaDeletar);
      setViagens(novaLista);
    } catch (erro) {
      console.error("Erro ao deletar a viagem:", erro);
      alert("Não foi possível excluir a viagem. Tente novamente.");
    }
  }

  const viagensFiltradas = viagens.filter((viagem) => {
    const termo = busca.toLowerCase();
    return (
      viagem.title.toLowerCase().includes(termo) ||
      viagem.city.toLowerCase().includes(termo) ||
      viagem.country.toLowerCase().includes(termo) ||
      viagem.destination.toLowerCase().includes(termo)
    );
  });

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  const pegarUrlDaImagem = (urlDoBanco: string) => {
    if (!urlDoBanco) return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop";
    if (urlDoBanco.startsWith("http")) return urlDoBanco;
    return `http://localhost:3333${urlDoBanco.startsWith('/') ? '' : '/'}${urlDoBanco}`;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header busca={busca} setBusca={setBusca} />

      <div className="flex flex-1">
        <aside className="w-64 bg-[#A3BFFA] p-6 flex flex-col gap-4 border-r border-slate-300 shadow-md z-10 min-h-full">
          <h1 className="text-[#00153B] text-xl font-bold mb-4 px-2">Agenda de viagens</h1>

          {/* Formulário agora recebe a viagemParaEditar e sabe como fechar a edição */}
          <Formulario
            onSalvar={carregarViagens}
            viagemEditada={viagemParaEditar}
            onFecharEdicao={() => setViagemParaEditar(null)}
          />
        </aside>

        <main className="flex-1 p-10 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {viagensFiltradas.map((viagem) => (
              <CardViagem
                key={viagem.id}
                viagem={{
                  ...viagem,
                  startDate: formatarData(viagem.startDate),
                  endDate: formatarData(viagem.endDate),
                  imageUrl: pegarUrlDaImagem(viagem.imageUrl)
                }}
                onDeletar={deletarViagem}
                // Ignoramos a viagem formatada pelo card e passamos a viagem ORIGINAL do map para o form
                onEditar={() => setViagemParaEditar(viagem)}
              />
            ))}

            {viagens.length === 0 && (
              <p className="text-slate-400 col-span-full">
                Nenhuma viagem cadastrada. Clique em "Criar viagem" para começar!
              </p>
            )}

            {viagens.length > 0 && viagensFiltradas.length === 0 && (
              <p className="text-slate-400 col-span-full">
                Nenhuma viagem encontrada com o termo "{busca}".
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}