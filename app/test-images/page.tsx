import Image from 'next/image'

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Test Images Page</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4">
          <h2 className="font-bold mb-2">FCA Logo</h2>
          <Image
            src="/images/regulators/fca-logo.svg"
            alt="FCA logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        
        <div className="border p-4">
          <h2 className="font-bold mb-2">CySEC Logo</h2>
          <Image
            src="/images/regulators/cysec-logo.svg"
            alt="CySEC logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        
        <div className="border p-4">
          <h2 className="font-bold mb-2">ASIC Logo</h2>
          <Image
            src="/images/regulators/asic-logo.svg"
            alt="ASIC logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
