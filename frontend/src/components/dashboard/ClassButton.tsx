import { Button, type ButtonProps } from "@mantine/core";
import type { ReactNode } from "react";

interface ClassButtonProps extends ButtonProps {
  children: ReactNode;
  active?: boolean;
}

export const ClassButton = ({ children, active, ...props }: ClassButtonProps) => {
  return (
		<div className="w-40">
			<Button
				{...props}
				variant={active ? "filled" : "outline"}
				color="blue"
				size="xs"
				fullWidth
			>
				{children}
			</Button>
		</div>
  );
};