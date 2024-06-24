import Image from 'next/image'

interface SpinnerPropTypes {
  className?: string
}

const Spinner = ({ className }: SpinnerPropTypes) => (
  <div className={`flex flex-col items-center justify-center ${className ?? ''}`}>
    <Image src="/IconV3.png" className="animate-spin w-16 h-16 rounded-full" width={100} height={100} alt="" />
  </div>
)

export default Spinner
