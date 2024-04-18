import { Input, Slider } from "@material-tailwind/react";
import { useContext, useEffect } from "react";
import { BaseSyntheticEvent } from "react";
import { ModalContext } from "./modal";

interface PostData {
  score: number;
  comment: string;
}

interface EditPostParams {
  data: PostData;
  setData: (data: PostData) => void;
}
export default function EditPost({ data, setData }: EditPostParams) {
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    setData({
      score: modalContext.modalState.inputData?.score || 50,
      comment: modalContext.modalState.inputData?.comment || "",
    });
  }, []);

  return (
    <div>
      {data && (
        <>
          {modalContext.modalState?.inputData && (
            <>
              <p>
                Country: {modalContext.modalState.inputData?.country.name_en}
              </p>
              <p>
                Product: {modalContext.modalState.inputData?.product?.label}
              </p>
            </>
          )}

          <p className="mb-2">Score: {data?.score}</p>
          <Slider
            className="mb-10"
            value={data?.score}
            min={0}
            max={100}
            step={1}
            onChange={(event: BaseSyntheticEvent) => {
              setData({ ...data, score: event.target.value });
            }}
          />
          <Input
            label="Please add any comments"
            value={data?.comment}
            onChange={(event: BaseSyntheticEvent) => {
              setData({ ...data, comment: event.target.value });
            }}
            crossOrigin={undefined}
          />
        </>
      )}
    </div>
  );
}
