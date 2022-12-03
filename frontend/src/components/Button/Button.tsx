import { styled } from '@linaria/react';
import { FC } from 'react';

const Container = styled.button<ButtonProps>`
	background-color: ${(props) => `hsl(${props.color})`};
	border: ${(props) => props.border};
	border-radius: ${(props) => props.radius};
	padding: ${(props) => props.padding};
	fontsize: '1.25rem';
	fontfamily: 'var(--ff-serif) sans-serif';
	color: #fff;
`;

interface ButtonProps {
	border: string;
	color: string;
	children?: React.ReactNode;
	onClick: () => void;
	radius: string;
	padding: string;
}

export const Button: FC<ButtonProps> = ({ border, color, children, onClick, radius, padding }) => {
	return (
		<Container
			color={color}
			border={border}
			radius={radius}
			padding={padding}
			onClick={onClick}
		>
			{children}
		</Container>
	);
};
