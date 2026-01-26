"use client";
import CasosContainer from "@/components/casos/CasosContainer";
import { useParams } from "next/navigation";

export default function TestesPorCollectionId() {
  const { testCollectionId } = useParams();
  return (
    <div>
      <CasosContainer
        collectionId={
          Array.isArray(testCollectionId)
            ? testCollectionId[0]
            : testCollectionId
        }
      />
    </div>
  );
}
