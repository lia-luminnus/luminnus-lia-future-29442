import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { code: 'pt' as const, label: 'PT', name: 'Português', flag: 'https://flagcdn.com/w20/br.png', alt: 'BR' },
    { code: 'en' as const, label: 'EN', name: 'English', flag: 'https://flagcdn.com/w20/us.png', alt: 'US' },
    { code: 'es' as const, label: 'ES', name: 'Español', flag: 'https://flagcdn.com/w20/es.png', alt: 'ES' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const otherLanguages = languages.filter(lang => lang.code !== currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all duration-200"
          aria-label={currentLang.name}
        >
          <img src={currentLang.flag} alt={currentLang.alt} className="w-4 h-4 rounded-full" />
          <span>{currentLang.label}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background/95 backdrop-blur-md border-white/10 z-50"
      >
        {otherLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <img src={lang.flag} alt={lang.alt} className="w-4 h-4 rounded-full" />
            <span>{lang.label} - {lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
