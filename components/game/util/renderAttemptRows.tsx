import { IRenderAttemptRowsProps } from "@/interface";
import RenderAttemptRow from "./RenderAttemptRow";

const renderAttemptRows = ({
  totalAttempts = 6,
  ...props
}: IRenderAttemptRowsProps) => {
  return Array.from({ length: totalAttempts }).map((_, attemptIndex) => (
    <RenderAttemptRow key={`row-${attemptIndex}`} attemptIndex={attemptIndex} {...props} />
  ));
};

export default renderAttemptRows;
