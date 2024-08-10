import React from 'react'
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
export default function Render() {
    return (
        <Button className="flex items-center space-x-2">
        <LogIn size={16} />
        <span>Login</span>
      </Button>
    )
}
