import {
  Button,
  Input,
  List,
  ListItem,
  Slider,
  Spinner,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { BaseSyntheticEvent } from "react";
import { ApiContext, deletePost } from "../api";
import { UserContext } from "../page";
import { ModalType, Post } from "../types";
import { defaultModalState, ModalContext } from "./modal";

interface PostData {
  score: number;
  comment: string;
  id?: string;
}

interface EditPostParams {
  data: PostData;
  setData: (data: PostData | undefined) => void;
}
export default function EditPost({ data, setData }: EditPostParams) {
  const modalContext = useContext(ModalContext);
  const apiContext = useContext(ApiContext);
  const userContext = useContext(UserContext);

  const [editMode, setEditMode] = useState<boolean>(
    apiContext.apiData?.posts !== undefined &&
      apiContext.apiData?.posts?.length > 0
  );

  useEffect(() => {
    setData({
      score: modalContext.modalState.inputData?.score || 50,
      comment: modalContext.modalState.inputData?.comment || "",
    });
  }, []);

  const createPost = () => {
    modalContext.setModalState({
      ...modalContext.modalState,
      title: "Create post",
      showConfirm: true,
    });
    setEditMode(false);
  };

  const selectPost = (post: Post) => {
    modalContext.setModalState({
      ...modalContext.modalState,
      showConfirm: true,
    });
    setData({ ...data, ...post });
  };

  const _deletePost = () => {
    modalContext.setModalState({
      ...defaultModalState,
      ...{
        open: true,
        modalType: ModalType.BASIC,
        confirmAction: () => {
          deletePost(data as Post);
        },
      },
    });
  };

  const userCheck = (post: Post): boolean => {
    return post.user === userContext.userState.userName;
  };

  return (
    <div className="flex flex-col items-center">
      {!apiContext.apiLoading && (
        <>
          <>
            <div className="flex flex-col items-left w-full">
              {modalContext.modalState?.inputData && (
                <>
                  <p>
                    Country:{" "}
                    {modalContext.modalState.inputData?.country.name_en}
                  </p>
                  <p>
                    Product: {modalContext.modalState.inputData?.product?.label}
                  </p>
                </>
              )}

              {(!editMode || data?.id) && (
                <p className="mb-2">Score: {data?.score}</p>
              )}
            </div>
            {(!editMode || data?.id) && (
              <>
                <Slider
                  className="mb-10"
                  defaultValue={data?.score}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(event: BaseSyntheticEvent) => {
                    setData({ ...data, score: event.target.value });
                  }}
                />
                <Input
                  label="Please add any comments"
                  defaultValue={data?.comment}
                  onChange={(event: BaseSyntheticEvent) => {
                    setData({ ...data, comment: event.target.value });
                  }}
                  crossOrigin={undefined}
                />
              </>
            )}
          </>

          {editMode && data?.id && (
            <Button
              color="red"
              className="mt-2 self-end"
              onClick={() => _deletePost()}
            >
              <span>Delete post</span>
            </Button>
          )}

          {editMode && !data?.id && (
            <>
              <List className="w-full">
                {apiContext.apiData?.posts !== undefined &&
                  apiContext.apiData?.posts.map((post) => {
                    return (
                      <ListItem
                        key={post.id}
                        onClick={() => {
                          if (userCheck(post)) selectPost(post);
                        }}
                        disabled={!userCheck(post)}
                      >
                        {post.comment} : {post.score}
                      </ListItem>
                    );
                  })}
              </List>
              <p>OR</p>
              <Button color="blue" className="mt-2" onClick={createPost}>
                <span>Create post</span>
              </Button>
            </>
          )}
        </>
      )}

      {apiContext.apiLoading && <Spinner />}
    </div>
  );
}
