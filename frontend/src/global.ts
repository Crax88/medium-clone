import { css } from '@linaria/core';

export const globalCss = css`
	:global() {
		@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Source+Serif+Pro:wght@400;700&family=Titillium+Web:wght@700&display=swap');
		html {
			position: relative;
			min-height: 100vh;
			padding-bottom: 100px;
			box-sizing: border-box;
			-ms-text-size-adjust: 100%;
			-webkit-text-size-adjust: 100%;
		}
		* {
			padding: 0;
			margin: 0;
			border: 0px;
		}
		*,
		*:before,
		*:after {
			box-sizing: inherit;
			animation-duration: 0.01ms; 
			animation-iteration-count: 1
			transition-duration: 0.01ms;
			scroll-behavior: auto;
		}

		body {
			margin: 0;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			font-family: var(--ff-sans);
			font-size: 1rem;
			color: #373a3c;
			background-color: #fff;
			line-height: 1.5;
		}
		a,
		a:visited {
			text-decoration: none;
		}
		a:hover {
			text-decoration: none;
		}
		:focus,
		:active {
			outline: none;
		}
		a:focus,
		a:active {
			outline: none;
		}
		p {
			font-weight: 400;
		}
		ul li {
			list-style: none;
		}
		:root {
			--ff-sans: "Source Sans Pro", sans-serif;
			--ff-serif: "Source Serif Pro", serif;
			--ff-tillium: "Titillium Web", sans-serif;
			--ff-merri: "Merriweather Sans", sans-serif;
			--clr-dark: 204 4% 23%;
			--clr-primary: 120 39% 54%;
			--clr-white: 0 0% 100%;
			--clr-light: 0 0% 96%;
		}
	}
`;
