"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export function SheetContent({ children }: { children: ReactNode }) {
  return <Dialog.Portal><Dialog.Overlay className="sheet-overlay" /><Dialog.Content className="sheet-content"><Dialog.Title className="sr-only">Navigation</Dialog.Title><Dialog.Description className="sr-only">Explore Atelier Arvena.</Dialog.Description>{children}<Dialog.Close className="sheet-close" aria-label="Close navigation"><X size={24} strokeWidth={1.3} /></Dialog.Close></Dialog.Content></Dialog.Portal>;
}
