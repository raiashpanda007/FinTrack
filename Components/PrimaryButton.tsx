import { Button } from "@/components/ui/button";
interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
}
function PrimaryButton({ label, onClick }: PrimaryButtonProps) {
  return (
    <Button className="bg-red-500 text-white font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-400" onClick={onClick}>
      {label}
    </Button>
  );
}

export default PrimaryButton;
