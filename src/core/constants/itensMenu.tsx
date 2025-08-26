import { FilePen, Home, IdCard, Sheet, Type, TypeOutline, University } from "lucide-react";

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
    url:"/adm/cargos",
    icon: IdCard,
  },
]

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
]

const itemsUsuarioComum = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Unidades",
    url: "/unidades",
    icon: University,
  },
]

export {
  itemsAdm,
  itemsUsuarioComum,
  itemsAuditorAnalista,
};