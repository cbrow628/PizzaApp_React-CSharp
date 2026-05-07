export default function Story() {
  return (
    <div className="page" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>My Story</h1>

      <div
        style={{
          width: "100%",
          height: "350px",
          backgroundColor: "#e8e8e8",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "1rem",
          border: "2px dashed #ccc",
        }}
      >
        Photo coming soon
      </div>

      <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
        It all started with a simple love of pizza. Not just eating it, obsessing over it,
        thinking about it, dreaming about what made a great slice truly great. That passion pushed
        me into the kitchen, where my early attempts were, to put it kindly, humbling. Bad dough,
        soggy crusts, sauces that missed the mark — I made every mistake in the book. But with
        every failed pizza came a lesson, and with every lesson came a better pie. Over time, I
        refined my process, experimented relentlessly, and discovered the techniques that made all
        the difference: sourcing the freshest ingredients I could find, and building flavor the
        slow way using a poolish — a pre-fermented dough that adds a depth and complexity you
        simply can't rush. What started as a love of eating pizza became a craft I'm proud of, and
        every pizza I make today carries a little piece of that journey.
      </p>
    </div>
  );
}
