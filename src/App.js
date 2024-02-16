import "./App.css";
import { useEffect, useState } from "react";
import { fetchData } from "./utils/fetchData";
import { Card } from "./Card";
import { DebugViewer } from "./DebugViewer";

function App() {
  // PokeApiのURL
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  // ローディング中かどうか
  const [loading, setLoading] = useState(true);
  // 前のページのURL
  const [prevURL, setPrevURL] = useState("");
  // 次のページのURL
  const [nextURL, setNextURL] = useState("");
  // ポケモンのデータ
  const [pokemonData, setPokemonData] = useState([]);

  // ページの読み込み時に初回のポケモンのデータを取得
  useEffect(() => {
    initPokemonData();
    setLoading(false);
  }, []);

  // 初回のポケモンのデータを取得
  async function initPokemonData() {
    const response = await fetchData(initialURL);
    setPokemonData(await loadPokemonData(response.results));
    setNextURL(response.next);
  }

  // ポケモンのデータを取得する
  async function loadPokemonData(data) {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        // 各ポケモンのデータを取得
        let pokemonRecord = await fetchData(pokemon.url);
        // ポケモンの名前を取得
        let pokemonName = await loadPokemonName(pokemonRecord.species.url);
        // ポケモンの画像のパスを取得
        let pokemonImageUrl = loadPokemonImageUrl(pokemonRecord);
        // ポケモンのタイプを取得
        let pokemonTypeNames = await loadPokemonTypes(pokemonRecord);
        // ポケモンのとくせいを取得
        let pokemonAbilityNames = await loadPokemonAbilities(pokemonRecord);
        // ポケモンのおもさを取得
        let pokemonWeight = loadPokemonWeight(pokemonRecord);
        // ポケモンのたかさを取得
        let pokemonHeight = loadPokemonHeight(pokemonRecord);
        // ポケモンのデータをまとめる
        let pokemonResult = {
          name: pokemonName,
          imageUrl: pokemonImageUrl,
          typeNames: pokemonTypeNames,
          abilityNames: pokemonAbilityNames,
          weight: pokemonWeight,
          height: pokemonHeight,
        };
        return pokemonResult;
      })
    );
    console.log(_pokemonData);
    return _pokemonData;
  }

  // ポケモンの名前を取得する
  async function loadPokemonName(data) {
    let speciesData = await fetchData(data);
    let pokemonName = speciesData.names.find(
      (name) => name.language.name === "ja"
    ).name;
    return pokemonName;
  }

  // ポケモンの画像のパスを取得する
  function loadPokemonImageUrl(data) {
    return data.sprites.front_default;
  }

  // ポケモンのタイプを取得する
  async function loadPokemonTypes(data) {
    let typeNames = await Promise.all(
      data.types.map(async (type) => {
        let typeData = await fetchData(type.type.url);
        let typeName = typeData.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return typeName;
      })
    );
    return typeNames;
  }

  // ポケモンのとくせい（日本語）を取得
  async function loadPokemonAbilities(data) {
    let abilityNames = await Promise.all(
      data.abilities.map(async (ability) => {
        let abilityData = await fetchData(ability.ability.url);
        let abilityName = abilityData.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return abilityName;
      })
    );
    return abilityNames;
  }

  // ポケモンのおもさを取得
  function loadPokemonWeight(data) {
    // おもさをキログラムに変換
    let weight = (data.weight / 10).toFixed(1);
    return weight;
  }

  // ポケモンのたかさを取得
  function loadPokemonHeight(data) {
    // たかさをメートルに変換
    let height = (data.height / 10).toFixed(1);
    return height;
  }

  // 前のページに移動
  async function handlePrevPage() {
    if (prevURL) {
      setLoading(true);
      let response = await fetchData(prevURL);
      setPokemonData(await loadPokemonData(response.results));
      setNextURL(response.next);
      setPrevURL(response.previous);
      setLoading(false);
    }
  }

  // 次のページに移動
  async function handleNextPage() {
    if (nextURL) {
      setLoading(true);
      let response = await fetchData(nextURL);
      setPokemonData(await loadPokemonData(response.results));
      setNextURL(response.next);
      setPrevURL(response.previous);
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>ポケモンずかん</h1>
      {loading ? (
        <p className="loading">ロード中...</p>
      ) : (
        <div className="card-wrapper">
          {pokemonData.map((pokemon, index) => {
            return <Card key={index} {...pokemon} />;
          })}
        </div>
      )}
      <div className="button-wrapper">
        <button onClick={handlePrevPage}>前へ</button>
        <button onClick={handleNextPage}>次へ</button>
      </div>
      <DebugViewer pokemonData={pokemonData} />
    </div>
  );
}

export default App;
