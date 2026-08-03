import PageHeader from '../components/layout/PageHeader';

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="flex flex-col h-full bg-[#F7F9FC]">
      <PageHeader
        title={title}
        subtitle="Onder constructie"
        navItems={[{ label: 'Overzicht', to: '#' }]}
      />
      <div className="p-8 flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center h-64 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p>Deze pagina is nog in ontwikkeling.</p>
        </div>
      </div>
    </div>
  );
}
