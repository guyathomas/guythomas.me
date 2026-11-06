const reasons = [
  "Her kindness makes every room warmer.",
  "She's brilliant, curious, and endlessly thoughtful.",
  "Her laugh is the best sound in the world.",
  "She makes hard days easier and good days better.",
  "She's generous with her time, her heart, and her ideas.",
  "She's beautiful, inside and out.",
];

export function Home() {
  return (
    <main className="praise">
      <p className="eyebrow">A website dedicated to</p>
      <h1>Arsh</h1>
      <p className="lede">The most wonderful person I know.</p>
      <ul>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className="signoff">Arsh, you are amazing. ♥</p>
    </main>
  );
}
