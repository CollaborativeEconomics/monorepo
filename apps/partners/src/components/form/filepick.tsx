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
  label?: string;
  source?: string;
  accept?: string;
  className?: string;
}

const FilePick = forwardRef(
  (
    {
      id,
      label,
      name,
      source,
      accept,
      className,
      ...props
    }: FileProps,
    forwardedRef: ForwardedRef<HTMLInputElement>,
  ) => {
    //const [previews, setPreviews] = useState<string[]>([source || '']);
    const [fileName, setFileName] = useState<string>('');
    const localRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      //console.log('PICK', event.target)
      const files = event.target.files;
      props.onChange?.(event);
      if(files) {
        setFileName(files[0].name)
      }
    };

    return (
      <div className={`relative m-4 ${className ?? ''}`}>
        <label className="flex flex-row">
          <span className="inline-block w-full grow-1 bg-gray-700 rounded-l-lg m-0 mr-1 px-4">{label}</span>
          <span className="inline-block w-full grow-1 bg-gray-700 rounded-r-lg m-0 px-4">{fileName}</span>
          <input
            type="file"
            id={id}
            name={name || id}
            {...props}
            onChange={handleFileChange}
            className="hidden"
            accept={accept}
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
        </label>
      </div>
    );
  },
);

FilePick.displayName = 'FilePick';

export default FilePick;
