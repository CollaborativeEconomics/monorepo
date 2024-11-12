export function DappInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
      <InfoCard
        title="Fast & Scalable"
        description="Experience lightning-fast transactions with Starknet's Layer 2 scaling solution"
        icon="⚡"
      />
      <InfoCard
        title="Secure"
        description="Built on proven cryptographic principles ensuring your assets stay safe"
        icon="🔒"
      />
      <InfoCard
        title="Low Cost"
        description="Enjoy minimal transaction fees while maintaining Ethereum's security"
        icon="💰"
      />
    </div>
  );
}

function InfoCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 backdrop-blur-lg hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
} 