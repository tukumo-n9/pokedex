export const DebugViewer = ({ pokemonData }) => {
  return <pre>{JSON.stringify(pokemonData, null, 2)}</pre>;
};
