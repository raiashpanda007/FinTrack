import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import CreateUserDialogBox from "@/Components/Landing/CreateUserDialogBox";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">
      {/* Container for heading & description */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-red-500">
          FinTrack
        </h1>
        {/* Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
          Managing your finances doesn’t have to be complicated. With Personal
          Finance Visualizer, you can effortlessly track your transactions,
          categorize your spending, and set budgets – all in one simple and
          intuitive dashboard.
        </p>
      </div>

      {/* Buttons / Dialog */}
      <div className="w-full max-w-md mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <CreateUserDialogBox />
        <SecondaryButton label="Users" />
      </div>
    </div>
  );
}
