import { useEffect } from "react";
import type { AudioTerm } from "../types";
import { TermPageContent } from "./TermPageContent";

interface ModalProps {
  term: AudioTerm | null;
  searchQuery?: string;
  onClose: () => void;
  onSearchTerm: (term: string) => void;
  onOpenTerm: (term: AudioTerm) => void;
  termsData: AudioTerm[];
}


export function Modal({
  term,
  searchQuery = "",
  onClose,
  onSearchTerm,
  onOpenTerm,
  termsData,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (term) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [term, onClose]);

  if (!term) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-neutral-950 z-[1000] overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 modal-scrollbar">
        {/* Background gradients - same as main page */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl px-5 py-8 relative z-10">
          <TermPageContent 
            term={term} 
            searchQuery={searchQuery}
            onSearchTerm={(searchTerm) => {
              onClose();
              onSearchTerm(searchTerm);
            }}
            onOpenTerm={onOpenTerm}
            termsData={termsData}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
}
