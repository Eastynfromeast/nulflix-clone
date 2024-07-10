import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { RecoilRoot } from "recoil";
import { GlobalStyle } from "./theme/GlobalStyle";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<RecoilRoot>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<RouterProvider router={router} />
			</ThemeProvider>
		</RecoilRoot>
	</React.StrictMode>
);
