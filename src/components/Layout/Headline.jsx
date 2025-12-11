import LeftHeadline from "../Headline/LeftHeadline";
import GambarHeadline from "../Headline/GambarHeadline";
import { HEADLINES } from "../../utils/constants";

function Headline() {
  // Get first 7 headlines
  const headlines = HEADLINES.slice(0, 7);

  // Top 3 for middle (GambarHeadline)
  const middleHeadlines = headlines.slice(0, 3);

  // Items 4-5 for left
  const leftHeadlines = headlines.slice(3, 6);

  // Items 6-7 for right
  const rightHeadlines = headlines.slice(5, 7);

  return (
    <div className="bg-white px-5 pt-4 pb-5">
      {/* Desktop: 3 columns layout */}
      <div className="hidden md:flex flex-row justify-between gap-5">
        <LeftHeadline data={leftHeadlines} />
        <GambarHeadline data={middleHeadlines} />
        <LeftHeadline data={rightHeadlines} />
      </div>

      {/* Mobile: Image on top, headlines in 2 columns below */}
      <div className="md:hidden flex flex-col gap-5">
        <GambarHeadline data={middleHeadlines} />
        <div className="grid grid-cols-2 gap-4">
          <LeftHeadline data={leftHeadlines} />
          <LeftHeadline data={rightHeadlines} />
        </div>
      </div>
    </div>
  );
}

export default Headline;
