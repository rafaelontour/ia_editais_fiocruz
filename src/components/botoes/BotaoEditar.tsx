"use client";
import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";

export default function BotaoEditar({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="h-8 w-8 bg-branco border border-gray-300 hover:bg-branco hover:cursor-pointer rounded-sm"
      size="icon"
    >
      <PencilLine color="black" />
    </Button>
  );
}
