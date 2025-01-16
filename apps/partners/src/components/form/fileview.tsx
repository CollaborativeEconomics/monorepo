import React, {
  useState,
  useRef,
  useEffect,
  type MutableRefObject,
} from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface FileProps {
  id?: string;
  name?: string;
  source?: string;
  className?: string;
  width?: number;
  height?: number;
  register?: UseFormRegisterReturn;
  multiple?: boolean;
}

const FileView: React.FC<FileProps> = ({
  id,
  name,
  source,
  className,
  width = 250,
  height = 250,
  register,
  multiple = false,
}) => {
  const [previews, setPreviews] = useState<string[]>([source || '']);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file =>
        URL.createObjectURL(file),
      );
      setPreviews(newPreviews);
    }
  };

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      for (const preview of previews) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [previews]);

  const style = 'mx-auto';
  const size = `w-[${width}px] h-[${height}px]`;

  return (
    <div className={`relative ${size} m-4 ${className ?? ''}`}>
      <input
        type="file"
        id={id}
        name={name||id}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        ref={e => {
          register?.ref(e);
          fileInputRef.current = e;
        }}
      />
      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <button
            type="button"
            key={`preview-${preview}`}
            onClick={() => fileInputRef.current?.click()}
            className="p-0 border-0 bg-transparent"
          >
            <img
              className={style}
              src={preview}
              width={`${width}px`}
              height={`${height}px`}
              alt={`preview ${index + 1}`}
            />
          </button>
        ))}
      </div>
      {previews.length === 0 && (
        <div
          className={`${size} border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
        >
          Click to upload images
        </div>
      )}
    </div>
  );
};

export default FileView;
