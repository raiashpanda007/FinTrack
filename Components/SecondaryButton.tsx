import { Button } from "@/components/ui/button"
interface ButtonProps{
    label: string;
    onClick?: () => void;
  }
function SecondaryButton({label,onClick}:ButtonProps) {
  return (
    <Button >
        {label}
    </Button>
  )
}

export default SecondaryButton