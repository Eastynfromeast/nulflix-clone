import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Tv from "./routes/Tv";
import Search from "./routes/Search";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "",
				element: <Home />,
			},
			{
				path: "tv",
				element: <Tv />,
			},
			{
				path: "search",
				element: <Search />,
			},
		],
	},
]);
