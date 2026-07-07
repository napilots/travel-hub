interface HeaderProps {
  busca: string;
  setBusca: (valor: string) => void;
}

function Header({ busca, setBusca }: HeaderProps) {
  return (
    <header className="relative flex items-center justify-between bg-[#00153B] text-white h-30 w-full shrink-0 shadow-md z-20 px-12.5">

      <div className="flex items-center">
        <img
          className="h-20"
          src="/aviao.webp"
          alt="Imagem avião"
        />
        <p className="ml-7.5 text-[40px] font-bold whitespace-nowrap">
          Travel Hub
        </p>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-200 px-4">
        <input
          type="text"
          placeholder="Buscar viagens..."
          className="h-12.5 w-full rounded-xl pl-6.25 text-[20px] bg-[#2B5B9E] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4656C7] transition-all"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

    </header>
  );
}

export default Header