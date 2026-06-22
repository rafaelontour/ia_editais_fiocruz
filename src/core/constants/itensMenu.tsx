import {
  Bot,
  Building,
  FilePen,
  Home,
  IdCard,
  InboxIcon,
  Sheet,
  Type,
  FolderOpenDot,
  Settings,
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
    title: "OiacIA",
    url: "/adm/assistente",
    icon: Bot,
  },
  {
    title: "Projetos",
    url: "/adm/projetos",
    icon: FolderOpenDot,
  },
  {
    title: "Meus documentos",
    url: "/adm/editais",
    icon: Sheet,
  },
  {
    title: "Tipificações",
    url: "/adm/tipificacoes",
    icon: Type,
  },
  {
    title: "Configurador",
    url: "/adm/configurador",
    icon: Settings,
  },
  {
    title: "Fontes",
    url: "/adm/fontes",
    icon: FilePen,
  },
  // {
  //   title: "Unidades",
  //   url: "/adm/unidades",
  //   icon: Building,
  // },
  {
    title: "Atribuição de cargo",
    url: "/adm/cargos",
    icon: IdCard,
  },
  {
    title: "Docs. Arquivados",
    url: "/adm/editais/arquivados",
    icon: InboxIcon,
  },
];

const itemsAuditorAnalista = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "OiacIA",
    url: "/adm/assistente",
    icon: Bot,
  },
  {
    title: "Projetos",
    url: "/adm/projetos",
    icon: FolderOpenDot,
  },
  {
    title: "Meus documentos",
    url: "/adm/editais",
    icon: Sheet,
  },
  {
    title: "Tipificações",
    url: "/adm/tipificacoes",
    icon: Type,
  },
  {
    title: "Docs. Arquivados",
    url: "/adm/editais/arquivados",
    icon: InboxIcon,
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
