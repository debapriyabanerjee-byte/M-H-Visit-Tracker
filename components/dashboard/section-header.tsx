export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h2>
      {action}
    </div>
  );
}
