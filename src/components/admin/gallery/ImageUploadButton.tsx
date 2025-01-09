import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadButtonProps {
  id: string;
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export const ImageUploadButton = ({ id, isUploading, onFileSelect, label }: ImageUploadButtonProps) => {
  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/heic"
        onChange={onFileSelect}
        disabled={isUploading}
      />
      <Button 
        type="button"
        className="w-full bg-[#004d40] hover:bg-[#00695c]"
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" /> 
        {isUploading ? 'Загрузка...' : label}
      </Button>
    </div>
  );
};