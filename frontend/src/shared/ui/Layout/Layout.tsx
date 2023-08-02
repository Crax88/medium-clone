import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type Props = {
	headerSlot: ReactNode;
	footerSlot: ReactNode;
};

const Layout = ({ headerSlot, footerSlot }: Props) => {
	return (
		<>
			{headerSlot}
			<main>
				<Outlet />
			</main>
			{footerSlot}
		</>
	);
};
export default Layout;
