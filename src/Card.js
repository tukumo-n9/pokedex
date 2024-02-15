export const Card = ({
  name,
  imageUrl,
  typeNames,
  abilityNames,
  weight,
  height,
}) => {
  return (
    <div className="Card">
      <h2>{name}</h2>
      <img src={imageUrl} alt="" />
      <p>タイプ</p>
      <ul>
        {typeNames.map((typeName, index) => {
          return <li key={index}>{typeName}</li>;
        })}
      </ul>
      <p>とくせい: {abilityNames[0]}</p>
      <p>おもさ: {weight}kg</p>
      <p>たかさ: {height}m</p>
    </div>
  );
};
