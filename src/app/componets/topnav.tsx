import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { LogIn, LogOut, Utensils } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Topnav() {
  return (
<nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-white">

<div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] rounded-full flex items-center justify-center">
        <Utensils className="text-white" size={16} />
    </div>
    <span className="text-xl font-bold text-gray-800">Kain Tayo!</span>
</div>

<div className="flex items-center gap-4">
    <SignedOut>
        <SignInButton mode = "modal">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hover:from-[#C0392B] hover:to-[#D35400] text-white">
                <LogIn className="h-4 w-4" />
                Sign In
            </Button>
        </SignInButton>
    </SignedOut>

    <SignedIn>
        <SignOutButton > 
            <Button variant="destructive" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
        </SignOutButton>
    </SignedIn>
</div>
</nav>

  );
}