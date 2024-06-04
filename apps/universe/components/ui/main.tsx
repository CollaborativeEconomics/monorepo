import { ReactNode } from 'react';

interface MainProps {
  className?: string;
  children?: ReactNode;
}

const Main = ({ className, children }: MainProps) => {
  return (
    <main className={`flex min-h-screen flex-col items-stretch container mt-24 ${className||''}`}>
      {children}
    </main>
  )
}

export default Main