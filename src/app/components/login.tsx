import { Input } from "@material-tailwind/react";
import { BaseSyntheticEvent } from "react";

interface LoginParams {
  setData: (data: string) => void;
}
export default function Login({ setData }: LoginParams) {
  return (
    <div>
      <Input
        label={"Please enter your username"}
        onChange={(event: BaseSyntheticEvent) => {
          setData(event.target.value);
        }}
      />
    </div>
  );
}
