import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Language='en'|'si';
type Dict=Record<string,string>;
const dictionaries:Record<Language,Dict>={
  en:{
    home:'Home',explore:'Explore',safety:'Digital Safety',learn:'Learn',deals:'Deals',community:'Community',search:'Search',signIn:'Sign In',saved:'Saved',menu:'Menu',services:'Services',contact:'Contact',
    heroEyebrow:'NexVibe Cyber & Digital Hub',heroTitleA:'Learn. Investigate.',heroTitleB:'Secure. Build.',heroBody:'Everything Next in AI, Tech, Cybersecurity & Digital Growth — built for students, researchers, creators and safer digital life.',openSafety:'Open Digital Safety Centre',browseNews:'Latest Cyber News',searchPlaceholder:'Search alerts, tools, courses, CVEs, resources…'
  },
  si:{
    home:'මුල් පිටුව',explore:'ගවේෂණය',safety:'ඩිජිටල් ආරක්ෂාව',learn:'ඉගෙනීම',deals:'Deals',community:'ප්‍රජාව',search:'සෙවීම',signIn:'ඇතුළු වන්න',saved:'සුරකින්න',menu:'මෙනුව',services:'සේවා',contact:'සම්බන්ධ වන්න',
    heroEyebrow:'NexVibe Cyber & Digital Hub',heroTitleA:'ඉගෙන ගන්න. විමර්ශනය කරන්න.',heroTitleB:'ආරක්ෂා කරන්න. නිර්මාණය කරන්න.',heroBody:'AI, තාක්ෂණය, සයිබර් ආරක්ෂාව සහ ඩිජිටල් වර්ධනය ගැන වැදගත් දැනුම එකම තැනකින්.',openSafety:'Digital Safety Centre විවෘත කරන්න',browseNews:'අලුත්ම සයිබර් පුවත්',searchPlaceholder:'Alerts, tools, courses, CVEs, resources සොයන්න…'
  }
};

type Ctx={language:Language;setLanguage:(l:Language)=>void;t:(key:string)=>string};
const LanguageContext=createContext<Ctx>({language:'en',setLanguage:()=>{},t:k=>k});
export function LanguageProvider({children}:{children:ReactNode}){
  const [language,setLanguageState]=useState<Language>(()=>(localStorage.getItem('nexvibe-lang') as Language)||'en');
  useEffect(()=>{localStorage.setItem('nexvibe-lang',language);document.documentElement.lang=language==='si'?'si':'en'},[language]);
  const value=useMemo(()=>({language,setLanguage:(l:Language)=>setLanguageState(l),t:(key:string)=>dictionaries[language][key]||dictionaries.en[key]||key}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
