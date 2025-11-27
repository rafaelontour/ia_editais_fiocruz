import {
  CircleCheckBig,
  FilePen,
  Gauge,
  Home,
  IdCard,
  ListChecks,
  Sheet,
  Type,
  TypeOutline,
  University,
  Wrench,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
}

const itemsAdm = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Meus editais",
    url: "/adm/editais",
    icon: Sheet,
  },
  {
    title: "Tipificações",
    url: "/adm/tipificacoes",
    icon: Type,
  },
  {
    title: "Taxonomias",
    url: "/adm/taxonomias",
    icon: TypeOutline,
  },
  {
    title: "Fontes",
    url: "/adm/fontes",
    icon: FilePen,
  },
  {
    title: "Unidades",
    url: "/adm/unidades",
    icon: University,
  },
  {
    title: "Atribuição de cargo",
    url: "/adm/cargos",
    icon: IdCard,
  },
  {
    title: "Coleção de testes",
    url: "/adm/testes",
    icon: Wrench,
  },
  {
    title: "Métricas",
    url: "/adm/metricas",
    icon: Gauge,
  },
  {
    title: "Casos de Testes",
    url: "/adm/casos",
    icon: ListChecks,
  },
  {
    title: "Resultados",
    url: "/adm/resultados",
    icon: CircleCheckBig,
  },
];

const itemsAuditorAnalista = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Meus editais",
    url: "/adm/editais",
    icon: Sheet,
  },
];

const itemsUsuarioComum = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Unidades",
    url: "/unidades_fiocruz",
    icon: University,
  },
];

export { itemsAdm, itemsUsuarioComum, itemsAuditorAnalista };
