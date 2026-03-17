export default function BankCard({
  bankName,
  cardNumber,
  holder,
}: any) {
  return (
    <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 rounded-3xl shadow-xl text-white w-80">
      <p className="text-sm opacity-80">{bankName}</p>

      <div className="mt-8 text-lg tracking-widest">
        **** **** **** {cardNumber.slice(-4)}
      </div>

      <p className="mt-8 font-semibold">
        {holder}
      </p>
    </div>
  );
}