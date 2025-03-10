import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen w-full">
      <div className="w-full flex justify-center items-center">
        <h1 className="text-[100px] font-extrabold text-red-500 ">FinTrack</h1>
        <p>
          Managing your finances doesn’t have to be complicated. With Personal
          Finance Visualizer, you can effortlessly track your transactions,
          categorize your spending, and set budgets – all in one simple and
          intuitive dashboard.
        </p>
      </div>
      <div className="w-1/3 flex justify-evenly ">
        <PrimaryButton label="Create User" />
        <SecondaryButton label="Users" />
      </div>
    </div>
  );
}
