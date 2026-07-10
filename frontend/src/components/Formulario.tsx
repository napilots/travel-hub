import { useState, useEffect } from "react"
import { api } from "../services/api"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, PencilLine } from "lucide-react"

export interface CountryInfo {
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  flag: string;
  flagSvg: string;
  currencies: Record<string, any>;
  languages: Record<string, string>;
}

export interface ViagemData {
  id?: number;

  title: string;
  destination?: string | null;

  country: string;
  city: string;

  startDate: string;
  endDate: string;

  budget: number;
  description: string;

  imageUrl: string;

  countryInfo?: CountryInfo;

  weather?: {
    city: string;
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
  };
}

interface FormularioProps {
  onSalvar: () => void;
  viagemEditada?: ViagemData | null; 
  onFecharEdicao?: () => void; 
}

export function Formulario({ onSalvar, viagemEditada, onFecharEdicao }: FormularioProps) {
  const [title, setTitle] = useState("")
  const [destination, setDestination] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [description, setDescription] = useState("")
  
  const [minhaImagem, setMinhaImagem] = useState<string | null>(null)
  const [arquivoReal, setArquivoReal] = useState<File | null>(null)

  const [aberto, setAberto] = useState(false)
  const [editandoTitulo, setEditandoTitulo] = useState(false)

  useEffect(() => {
    if (viagemEditada) {
      setTitle(viagemEditada.title);
      setDestination(viagemEditada.destination || "");
      setCountry(viagemEditada.country);
      setCity(viagemEditada.city);
      setStartDate(viagemEditada.startDate ? viagemEditada.startDate.split('T')[0] : "");
      setEndDate(viagemEditada.endDate ? viagemEditada.endDate.split('T')[0] : "");
      setBudget(viagemEditada.budget.toString());
      setDescription(viagemEditada.description || "");

      if (viagemEditada.imageUrl) {
        const urlCompleta = viagemEditada.imageUrl.startsWith("http") 
          ? viagemEditada.imageUrl 
          : `http://localhost:3333${viagemEditada.imageUrl.startsWith('/') ? '' : '/'}${viagemEditada.imageUrl}`;
        setMinhaImagem(urlCompleta);
      }

      setEditandoTitulo(false);
      setAberto(true); 
    }
  }, [viagemEditada]);

  const limparFormulario = () => {
    setTitle(""); setDestination(""); setCountry(""); setCity(""); 
    setStartDate(""); setEndDate(""); setBudget(""); setDescription(""); 
    setMinhaImagem(null); setArquivoReal(null);
    if (onFecharEdicao) onFecharEdicao();
  }

  const lidarComMudancaAberto = (novoEstado: boolean) => {
    setAberto(novoEstado);
    if (!novoEstado) limparFormulario();
  }

  const lidarComUpload = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0]
    if (arquivo) {
      setArquivoReal(arquivo) 
      setMinhaImagem(URL.createObjectURL(arquivo)) 
    }
  }

  const lidarComSalvar = async () => {
    if (!title.trim()) {
      alert("Por favor, dê um título para a sua viagem!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("destination", destination);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("budget", budget.toString());
      formData.append("description", description);
      
      if (arquivoReal) {
        formData.append("image", arquivoReal);
      }

      if (viagemEditada?.id) {
        await api.put(`/trips/${viagemEditada.id}`, formData);
      } else {
        await api.post('/trips', formData);
      }

      onSalvar(); 
      lidarComMudancaAberto(false); 

    } catch (erro) {
      console.error("Erro ao salvar a viagem:", erro);
      alert("Ocorreu um erro ao salvar a viagem. Verifique se o Backend está rodando!");
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={lidarComMudancaAberto}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#4656C7] hover:bg-[#34429e] text-white justify-between shadow-sm font-semibold py-6 rounded-lg text-sm">
          Criar viagem <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-175 bg-[#00153B] text-white rounded-[32px] border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="mb-4">
          <DialogTitle asChild>
            {editandoTitulo ? (
              <input 
                autoFocus
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                onBlur={() => setEditandoTitulo(false)} 
                onKeyDown={(e) => e.key === 'Enter' && setEditandoTitulo(false)} 
                placeholder="Nome da Viagem..." 
                className="w-full text-2xl font-bold text-white bg-transparent border-b-2 border-[#4656C7] focus:outline-none pb-1"
              />
            ) : (
              <h2 
                onClick={() => setEditandoTitulo(true)}
                className="text-2xl font-bold text-white cursor-pointer hover:text-slate-300 transition-colors flex items-center gap-2 w-max"
              >
                {title || "Nova Viagem"} <PencilLine className="h-4 w-4 opacity-50" />
              </h2>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">País</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ex: Brasil" className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7]"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Estado / Província (Opcional)</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex: Bahia (deixe vazio se não aplicável)" className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7]"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Cidade</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Salvador" className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7]"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Orçamento Previsto (R$)</label>
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex: 5000" className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-300">
      Data de Ida
    </label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7] [&::-webkit-calendar-picker-indicator]:invert"
    />
  </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                Data de Volta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7] [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Descrição Opcional</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Um breve resumo sobre a viagem..." className="w-full bg-[#2B5B9E] text-white placeholder-slate-400 p-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#4656C7] resize-none h-20"/>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Foto do card</label>
            <input type="file" accept="image/*" onChange={lidarComUpload} className="bg-[#2B5B9E] text-white p-3 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-[#2B5B9E] hover:file:bg-slate-200" />
            {minhaImagem && (
              <div className="h-40 w-full rounded-2xl overflow-hidden mt-2 border-4 border-[#2B5B9E]">
                <img src={minhaImagem} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <Button onClick={lidarComSalvar} className="bg-[#4656C7] hover:bg-[#34429e] py-6 rounded-xl text-lg mt-2">
            {viagemEditada ? "Salvar Alterações" : "Salvar Viagem"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}