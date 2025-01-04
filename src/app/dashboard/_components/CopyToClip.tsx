"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

const CopyToClip = ({ CopyText }: { CopyText: string }) => {
  const [isCopied, setIsCopied] = useState<string>("Copy");
  const CopiedText = async function (cp: string) {
    try {
      await navigator.clipboard.writeText(cp);
      setIsCopied("Copied");
      setTimeout(() => {
        setIsCopied("Copy");
      }, 3000);
    } catch {
      setTimeout(() => {
        setIsCopied("Copy");
      }, 3000);
      
    }
  };

  return (
    <div className="flex flex-row gap-x-4 py-2">
      <Button onClick={() => CopiedText(CopyText)}>{isCopied}</Button>
      <DialogClose className="border px-2 rounded-lg hover:bg-gray-200 border-black" >
     Cancel
      </DialogClose>
    </div>
  );
};

export default CopyToClip;
