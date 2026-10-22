import { useState, useEffect } from "react";

type imageData = {
  id: number;
  flipped: boolean;
  url: string;
  matching: boolean;
};

function App() {
  const [imageSrc, setImageSrc] = useState<imageData[]>([]);
  const [moves, setMoves] = useState<number>(0);

  const getPokemonImg = (id: number) => {
    fetch(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImageSrc((prevItems: imageData[]) => [
          ...prevItems,
          { id: id, url, flipped: false, matching: false },
        ]);
      })
      .catch((error) => console.error("Error fetching image:", error));
  };

  useEffect(() => {
    if (imageSrc.length <= 16) {
      for (let i = 1; i <= 16; i++) {
        getPokemonImg(i);
      }
    }
  }, []);

  const resetImage = () => {
    setMoves(0);
    setImageSrc([]);
    if (imageSrc.length <= 16) {
      for (let i = 1; i <= 16; i++) {
        getPokemonImg(i);
      }
    }
  };

  const toggleFlip = (index: number) => {
    setImageSrc((imageData: imageData[]) =>
      imageData.map((image: imageData) =>
        image.id === index
          ? { ...image, flipped: true, matching: true }
          : image,
      ),
    );

    setMoves((prev) => prev + 1);
  };

  useEffect(() => {
    const matchedData: any = imageSrc.filter((img) => img.matching === true);
    if (matchedData.length === 2) {
      if (matchedData[0].url === matchedData[1].url) {
        console.log("matched");
        setImageSrc((imageData: imageData[]) =>
          imageData.map((image: imageData) =>
            image.id === matchedData[0]?.id
              ? { ...image, flipped: true, matching: false }
              : image,
          ),
        );
        setImageSrc((imageData: imageData[]) =>
          imageData.map((image: imageData) =>
            image.id === matchedData[1].url
              ? { ...image, flipped: true, matching: false }
              : image,
          ),
        );
      } else {
        console.log("not matched");
        setImageSrc((imageData: imageData[]) =>
          imageData.map((image: imageData) =>
            image.id === matchedData[0].url
              ? { ...image, flipped: false, matching: false }
              : image,
          ),
        );
        setImageSrc((imageData: imageData[]) =>
          imageData.map((image: imageData) =>
            image.id === matchedData[1].url
              ? { ...image, flipped: false, matching: false }
              : image,
          ),
        );
      }
    }
  }, [moves]);

  return (
    <div className="flex items-center justify-center flex-col h-screen w-[100vw]">
      <h1>Gotta Catch 'Em All</h1>
      <h2 className="pb-5">Number of moves: {moves}</h2>
      <div className="grid grid-cols-4 gap-4 w-max">
        {imageSrc.length === 16 &&
          imageSrc?.map((image: imageData) => (
            <div
              className="group w-20 [perspective:1000px]"
              onClick={
                image.flipped
                  ? () => console.log("already flipped")
                  : () => toggleFlip(image.id)
              }
            >
              <div
                className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
                  image?.flipped
                    ? "[transform:rotateY(180deg)]"
                    : "[transform:rotateY(0deg)]"
                }`}
              >
                <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] flex items-center justify-center">
                  ?
                </div>

                <div
                  key={image.id}
                  className={`aspect-square flex items-center justify-center border-2 border-slate-300 rounded-xl bg-white shadow-xs hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer [backface-visibility:hidden] [transform:rotateY(180deg)]`}
                >
                  <img
                    className="text-lg font-semibold text-slate-700"
                    src={image.url}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      {imageSrc.length !== 16 && <div>Loading...</div>}

      <button
        className="bg-blue-400 px-5 py-3 mt-5 mb-5 rounded-lg text-white"
        onClick={resetImage}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
