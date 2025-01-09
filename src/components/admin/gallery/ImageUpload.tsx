import { Label } from "@/components/ui/label";
import { ImageUploadButton } from "./ImageUploadButton";

interface ImageUploadProps {
  label: string;
  imageUrl: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  inputId: string;
}

export const ImageUpload = ({ label, imageUrl, isUploading, onUpload, inputId }: ImageUploadProps) => {
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
        <ImageUploadButton
          id={inputId}
          isUploading={isUploading}
          onFileSelect={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          label="Загрузить фото"
        />
      </div>
    </div>
  );
};