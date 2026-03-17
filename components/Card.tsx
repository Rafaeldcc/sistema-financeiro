export default function Card({
  title,
  value,
  color,
  subtitle,
}: any) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <p className="text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>
        R$ {value.toFixed(2)}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}