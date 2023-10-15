import { useState } from "react";
import { API_URL } from "../../lib/constants";
import { PostShape } from "../../lib/types";

export default function ManipulatePost({ id = "no id" }) {
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  async function deletePost(postId) {
    try {
      const response = await fetch(`${API_URL}/social/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await response.json();
      console.log("deleted post>", json);
    } catch (error) {
      console.warn("deletePost error", error);
    } finally {
      null;
    }
  }

  async function handleOnEdit() {
    setIsEditing(true);
  }
  async function handleOnDelete() {
    deletePost(id);
  }
  async function editPost(event) {
    event.preventDefault();
    handleOnEdit();

    const { body, title, postId } = event.target.elements;

    const formattedPostId = Number(postId.value);

    const payload = {
      title: title.value,
      body: body.value,
    };

    try {
      const response = await fetch(
        `${API_URL}/social/posts/${formattedPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await response.json();

      console.warn("Success, updated post!", json);
    } catch (error) {
      console.warn("Couldn't update post", error);
    } finally {
      null;
    }
  }
  return (
    <>
      {isEditing ? (
        <>
          <form
            className="flex gap-2"
            onSubmit={(event) => editPost(event, setIsEditing)}
          >
            <input type="hidden" name="postId" id="postId" value={id} />
            <input
              className="bg-blue-100 px-1 hover:bg-blue-200 rounded-sm"
              name="title"
              id="title"
              type="text"
              placeholder="Title"
            />
            <input
              className="bg-blue-100 px-1 hover:bg-blue-200 rounded-sm"
              name="body"
              id="body"
              type="text"
              placeholder="Body"
            />
            <input
              className="bg-blue-300 hover:bg-blue-400 px-3 py-1 cursor-pointer rounded-sm "
              type="submit"
              value="Update"
            />
            <button
              className="bg-red-100 px-2 hover:bg-red-300 rounded-sm"
              onClick={() => setIsEditing(false)}
            >
              X
            </button>
          </form>
        </>
      ) : (
        <button
          className="bg-blue-300 hover:bg-blue-500 rounded-sm px-3 "
          onClick={editPost}
        >
          Edit
        </button>
      )}
      <button
        onClick={handleOnDelete}
        className="bg-red-200 rounded-sm self-end px-3 hover:bg-red-500"
      >
        Delete
      </button>
    </>
  );
}
ManipulatePost.propTypes = PostShape;
