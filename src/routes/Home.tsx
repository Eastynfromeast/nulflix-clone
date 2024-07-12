import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies } from "../api";

const Container = styled.div`
	height: 200vh;
`;

function Home() {
	const { data, isLoading } = useQuery({
		queryKey: ["movies"],
		queryFn: getMovies,
	});

	console.log(data);
	return (
		<Container>
			<h1>Home</h1>
		</Container>
	);
}

export default Home;
