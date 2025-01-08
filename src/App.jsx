import GameBoard from "./GameBoard";

function App() {
  return (
    <div className="bg-[#f0f0f0] flex items-center justify-center">
      <div className="relative">
        {/* Nokia Phone Image */}
        <img
          src="/log-on-log.png"
          alt="Nokia 3310"
          className="w-screen h-screen"
        />
        {/* Heading Over the Image */}
        <p className="absolute bottom-5 left-[70%] text-white text-2xl font-bold italic">
          work in progress, not final product.
        </p>
        {/* Game Screen Overlay */}
        <div className="absolute top-[30%] left-[42.7%] w-[275px] h-[174px] overflow-hidden rounded-md">
          <GameBoard />
        </div>
      </div>
    </div>
  );
}

export default App;
