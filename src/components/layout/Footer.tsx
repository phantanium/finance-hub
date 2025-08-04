import { Download, FileSpreadsheet, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const handleExport = (format: string) => {
    // Export functionality would be implemented here
    console.log(`Exporting as ${format}`);
  };

  return (
    <footer className="h-16 border-t border-border bg-card shadow-card">
      <div className="flex items-center justify-between h-full px-6">
        <div className="text-sm text-muted-foreground">
          © 2024 FinDash Indonesia. Professional Financial Analysis Dashboard.
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Export:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-smooth"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="gap-2 hover:bg-success/10 hover:text-success transition-smooth"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('png')}
            className="gap-2 hover:bg-primary/10 hover:text-primary transition-smooth"
          >
            <Camera className="h-4 w-4" />
            PNG
          </Button>
        </div>
      </div>
    </footer>
  );
}