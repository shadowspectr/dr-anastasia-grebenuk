import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  label: string;
  imageUrl: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  inputId: string;
}

export const ImageUpload = ({ label, imageUrl, isUploading, onUpload, inputId }: ImageUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        )}
        <div className="relative">
          <input
            type="file"
            id={inputId}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/heic"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            type="button"
            className="w-full bg-[#004d40] hover:bg-[#00695c]"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Загрузка...' : 'Загрузить фото'}
          </Button>
        </div>
      </div>
    </div>
  );
};