import React from 'react';

interface MonteryLanguageDropdownProps {
  selectedLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  className?: string;
  inline?: boolean;
}

export function MonteryLanguageDropdown({ selectedLanguage = 'en', onLanguageChange, className, inline = false }: MonteryLanguageDropdownProps) {
  const options = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'ar', label: 'العربية' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'ko', label: '한국어' },
    { code: 'zh', label: '中文 (简体)' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  if (inline) {
    return (
      <div className={`flex items-center space-x-1.5 px-2 py-1 bg-slate-950/60 border border-white/5 rounded-lg font-mono text-[10px] ${className || ""}`}>
        <span className="text-emerald-400 animate-pulse text-[10px] leading-none">●</span>
        <span className="text-slate-400 font-bold tracking-wider uppercase">LANG:</span>
        <select 
          value={selectedLanguage} 
          onChange={handleChange}
          className="bg-transparent text-slate-200 outline-none cursor-pointer font-mono font-medium focus:text-slate-100 pr-1 border-none"
        >
          {options.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-950 text-white font-mono">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div id="montery-lang-dropdown-container" className={className || "fixed top-6 right-6 z-50 p-1.5 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex items-center space-x-2.5 pointer-events-auto font-mono text-[11px]"}>
      <div className="flex items-center space-x-1.5 pl-2 text-slate-400 font-bold uppercase tracking-wider">
        <span className="animate-pulse text-emerald-400 text-xs">●</span>
        <span>LANG:</span>
      </div>
      <select 
        value={selectedLanguage} 
        onChange={handleChange}
        className="h-8 px-3 bg-slate-900 border border-white/5 rounded-lg text-slate-200 outline-none focus:border-emerald-500/40 hover:border-white/20 cursor-pointer font-mono font-medium transition-all"
      >
        {options.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-950 text-white font-mono">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
