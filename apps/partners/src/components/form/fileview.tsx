import Image from 'next/image';
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  type ForwardedRef,
} from 'react';

interface FileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  source?: string;
  className?: string;
  width?: number;
  height?: number;
  multiple?: boolean;
}

const FileView = forwardRef(
  (
    {
      id,
      name,
      source,
      className,
      width = 250,
      height = 250,
      multiple = false,
      ...props
    }: FileProps,
    forwardedRef: ForwardedRef<HTMLInputElement>,
  ) => {
    const [previews, setPreviews] = useState<string[]>([source || '']);
    const localRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      props.onChange?.(event);
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
          name={name || id}
          {...props}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple={multiple}
          ref={element => {
            // Set local ref
            localRef.current = element;

            // Handle forwarded ref
            if (typeof forwardedRef === 'function') {
              forwardedRef(element);
            } else if (forwardedRef) {
              forwardedRef.current = element;
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <button
              type="button"
              key={`preview-${preview}`}
              onClick={() => localRef.current?.click()}
              className="p-0 border-0 bg-transparent"
            >
              <Image
                className={style}
                src={preview}
                width={width}
                height={height}
                objectFit="cover"
                alt={`preview ${index + 1}`}
              />
            </button>
          ))}
        </div>
        {previews.length === 0 && (
          <button
            type="button"
            className={`${size} border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer`}
            onClick={() => localRef.current?.click()}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                localRef.current?.click();
              }
            }}
            tabIndex={0}
          >
            Click to upload images
          </button>
        )}
      </div>
    );
  },
);

FileView.displayName = 'FileView';

export default FileView;
