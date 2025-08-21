import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { X, ExternalLink, FileText } from 'lucide-react';

interface EvidenceChunk {
  chunk_id: string;
  url: string;
  excerpt: string;
  date: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerName: string;
  evidence: EvidenceChunk[];
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  brokerName,
  evidence
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Evidence for {brokerName}
            </DialogTitle>
            <DialogClose asChild>
              <button className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            All evidence is sourced from verified reviews, regulatory filings, and user reports
          </p>

          {evidence.map((item, index) => (
            <Card key={item.chunk_id} className="modern-card border-white/10">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed mb-2">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white/60 text-xs">
                      Source #{index + 1} • {item.date}
                    </span>
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Source
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {evidence.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No evidence available for this broker</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;