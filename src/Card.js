import "./Card.css";

export const Card = ({
  name,
  imageUrl,
  typeNames,
  abilityNames,
  weight,
  height,
}) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <figure>
        <img src={imageUrl} alt="" />
      </figure>
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
