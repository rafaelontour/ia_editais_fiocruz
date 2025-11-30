import {
  Building,
  FilePen,
  Gauge,
  Home,
  IdCard,
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
    title: "Fontes",
    url: "/adm/fontes",
    icon: FilePen,
  },
  {
    title: "Unidades",
    url: "/adm/unidades",
    icon: Building,
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
  {
    title: "Tipificações",
    url: "/adm/tipificacoes",
    icon: Type,
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
    icon: Building,
  },
];

export { itemsAdm, itemsUsuarioComum, itemsAuditorAnalista };
