import { useState, useEffect } from "react"
import { api } from "../services/api"
import { Calendar, Trash2, CloudSun, CheckSquare, MapPin, PencilLine, DollarSign, Info, Plus } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type ViagemData } from "./Formulario"

interface Tarefa {
  id: number;
  title: string;
  completed: boolean;
  tripId: number;
}

interface ViagemProps {
  viagem: ViagemData;
  onDeletar: (id: number) => void;
  onEditar: (viagem: ViagemData) => void;
}

export function CardViagem({ viagem, onDeletar, onEditar }: ViagemProps) {
  const [modalAberto, setModalAberto] = useState(false);
  
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefaTexto, setNovaTarefaTexto] = useState("");
  const [carregandoTarefas, setCarregandoTarefas] = useState(false);

  const [clima, setClima] = useState<any>(null);
  const [carregandoClima, setCarregandoClima] = useState(false);

  const orcamentoFormatado = Number(viagem.budget).toLocaleString('pt-BR', { 
    style: 'currency', currency: 'BRL' 
  });

  useEffect(() => {
    if (modalAberto && viagem.id) {
      carregarTarefas();
      buscarClima();
    }
  }, [modalAberto, viagem.id]);

  
  // puxando o clima do back
  const buscarClima = async () => {
    if (!viagem.city) return;
    
    setCarregandoClima(true);
    try {
      const resposta = await api.get(`/weather/${viagem.city}`);
      setClima(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar clima no backend:", erro);
    } finally {
      setCarregandoClima(false);
    }
  };


  // pegando checklist do back
  const carregarTarefas = async () => {
    setCarregandoTarefas(true);
    try {
      const resposta = await api.get('/checklists');
      const tarefasDestaViagem = resposta.data.filter((t: Tarefa) => t.tripId === viagem.id);
      setTarefas(tarefasDestaViagem);
    } catch (erro) {
      console.error("Erro ao carregar checklists:", erro);
    } finally {
      setCarregandoTarefas(false);
    }
  };

  const adicionarTarefa = async () => {
    if (!novaTarefaTexto.trim()) return;
    try {
      const resposta = await api.post('/checklists', {
        title: novaTarefaTexto,
        tripId: viagem.id,
        completed: false
      });
      setTarefas([...tarefas, resposta.data]);
      setNovaTarefaTexto(""); 
    } catch (erro) {
      console.error("Erro ao criar tarefa:", erro);
    }
  };

  const alternarTarefa = async (tarefa: Tarefa) => {
    setTarefas(tarefas.map(t => t.id === tarefa.id ? { ...t, completed: !t.completed } : t));
    try {
      await api.put(`/checklists/${tarefa.id}`, {
        title: tarefa.title,
        tripId: tarefa.tripId,
        completed: !tarefa.completed
      });
    } catch (erro) {
      carregarTarefas(); 
    }
  };

  const deletarTarefa = async (id: number) => {
    try {
      await api.delete(`/checklists/${id}`);
      setTarefas(tarefas.filter(t => t.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar tarefa:", erro);
    }
  };

  return (
    <Dialog open={modalAberto} onOpenChange={setModalAberto}>
      <DialogTrigger asChild>
        <div className="relative flex flex-col w-full max-w-65 rounded-[32px] overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[#2B5B9E] text-white group text-left">
          <div className="h-40 w-full bg-slate-300">
            <img src={viagem.imageUrl} alt={`Foto de ${viagem.title}`} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-wide leading-tight line-clamp-1">
                {viagem.city || viagem.title}
              </h2>
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {viagem.country}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">{viagem.startDate} a {viagem.endDate}</span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-200 bg-[#00153B] text-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        
        {/* Header do modal */}
        <div className="relative h-56 w-full">
          <img src={viagem.imageUrl} alt={viagem.title} className="w-full h-full object-cover opacity-50" />
          
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <Button onClick={() => { setModalAberto(false); onEditar(viagem); }} className="bg-[#4656C7] hover:bg-[#34429e] text-white rounded-full h-10 w-10 p-0 shadow-lg transition-colors">
              <PencilLine className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-full h-10 w-10 p-0 shadow-lg bg-white hover:bg-red-700 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-106 bg-[#00153B] text-white border-none rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Viagem?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-300">
                    Tem certeza que deseja excluir a viagem <strong>{viagem.title}</strong>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-white border-slate-500 hover:bg-slate-800">Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onDeletar(viagem.id!)}>Sim, excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="absolute bottom-6 left-8 flex flex-col drop-shadow-md pr-8">
            <DialogTitle className="text-4xl font-bold text-white">{viagem.title}</DialogTitle>
            <p className="text-lg text-slate-200 flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" /> {viagem.city}{viagem.destination ? `, ${viagem.destination}` : ""} - {viagem.country}
            </p>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-8 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#1A365D] p-4 rounded-2xl border border-[#2B5B9E]">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#4D61FC]" />
              <div className="flex flex-col"><span className="text-xs text-slate-400">Ida</span><span className="text-sm font-bold">{viagem.startDate}</span></div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#4D61FC]" />
              <div className="flex flex-col"><span className="text-xs text-slate-400">Volta</span><span className="text-sm font-bold">{viagem.endDate}</span></div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div className="flex flex-col"><span className="text-xs text-slate-400">Orçamento</span><span className="text-sm font-bold">{orcamentoFormatado}</span></div>
            </div>
          </div>

          {viagem.description && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Info className="h-4 w-4" /> Sobre a Viagem</h3>
              <p className="text-slate-200 text-md leading-relaxed bg-[#2B5B9E] p-4 rounded-xl">{viagem.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* checklist */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-[#4D61FC]" /> Checklist
              </h3>
              
              <div className="bg-[#1A365D] p-4 rounded-2xl border border-[#2B5B9E] flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaTarefaTexto}
                    onChange={(e) => setNovaTarefaTexto(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
                    placeholder="Adicionar item à mala..."
                    className="flex-1 bg-[#00153B] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4656C7] placeholder:text-slate-500"
                  />
                  <Button onClick={adicionarTarefa} className="bg-[#4656C7] hover:bg-[#34429e] rounded-xl px-4 text-white">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-45 overflow-y-auto pr-1 custom-scrollbar">
                  {carregandoTarefas ? (
                    <p className="text-slate-400 text-sm text-center py-4">Carregando itens...</p>
                  ) : tarefas.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4 italic">Nenhum item na sua checklist ainda.</p>
                  ) : (
                    tarefas.map((tarefa) => (
                      <div key={tarefa.id} className="flex items-center justify-between bg-[#2B5B9E] p-3 rounded-xl group transition-all">
                        <label className="flex items-center gap-3 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={tarefa.completed}
                            onChange={() => alternarTarefa(tarefa)}
                            className="h-5 w-5 rounded border-slate-400 bg-[#00153B] text-[#4656C7] focus:ring-[#4656C7] cursor-pointer"
                          />
                          <span className={`text-sm transition-all ${tarefa.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {tarefa.title}
                          </span>
                        </label>
                        <button 
                          onClick={() => deletarTarefa(tarefa.id)} 
                          className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CLIMA (puxando do back) */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-yellow-400" /> Clima Local
              </h3>
              <div className="bg-[#2B5B9E] p-5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center h-45">
                {carregandoClima ? (
                  <p className="text-slate-300 text-sm animate-pulse">Consultando previsão...</p>
                ) : clima && clima.temperature !== null ? (
                  <>
                    <img 
                      src={clima.icon} 
                      alt="Ícone do Clima" 
                      className="h-16 w-16 drop-shadow-md" 
                    />
                    <span className="text-3xl font-bold text-white">{Math.round(clima.temperature)}°C</span>
                    <span className="text-sm text-slate-300 capitalize">{clima.description}</span>
                    <span className="text-xs text-slate-400 mt-1">Sensação de {Math.round(clima.feelsLike)}°C</span>
                  </>
                ) : (
                  <p className="text-slate-300 text-sm">Clima indisponível para esta cidade.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}