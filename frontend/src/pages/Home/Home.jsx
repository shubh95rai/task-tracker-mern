import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { getToken, removeToken } from "../../utils/auth";
import { toast } from "sonner";
import EmptyCard from "@/components/Cards/EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoNotesImg from "../../assets/images/no-notes.svg";

export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  function handleEditNote(noteDetails) {
    setOpenAddEditModal({ isOpen: true, type: "edit", data: noteDetails });
  }

  // get user info
  async function getUserInfo() {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.data.success === false) {
        removeToken();
        navigate("/login");
      }
    }
  }

  // get all notes
  async function getAllNotes() {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  async function handleDeleteNote(noteId) {
    // Optimistically remove the note
    const previousNotes = allNotes;
    setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

    toast.warning("Note deleted successfully");

    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      if (response.data.success) {
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An expected error occurred. Please try again.");
      }

      // Revert optimistic update on failure
      setAllNotes(previousNotes);
      toast.error("Failed to delete note. Please try again.");
    }
  }

  async function onSearchNotes(query) {
    try {
      const response = await axiosInstance.get(`/search-notes?query=${query}`);
      if (response.data.success) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  async function handleClearSearch() {
    await getAllNotes();
    setIsSearch(false);
  }

  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    setTokenReady(true); // important
  }, []);

  useEffect(() => {
    if (!tokenReady) return; // wait until token is applied
    getUserInfo();
    getAllNotes();
    return () => {};
  }, [tokenReady]);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNotes={onSearchNotes}
        handleClearSearch={handleClearSearch}
        isSearch={isSearch}
      />

      <div className="container mx-auto px-4 py-24">
        {allNotes?.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-4 mt-">
            {allNotes.map((note, index) => {
              return (
                <NoteCard
                  key={index}
                  title={note.title}
                  content={note.content}
                  createdAtDate={note.createdAt}
                  updatedAtDate={note.updatedAt}
                  tags={note.tags}
                  status={note.status}
                  onEdit={() => {
                    handleEditNote(note);
                  }}
                  onDelete={() => {
                    handleDeleteNote(note._id);
                  }}
                />
              );
            })}
          </div>
        )}
        {allNotes?.length === 0 && (
          <EmptyCard
            imgSrc={isSearch ? NoNotesImg : AddNotesImg}
            message={
              isSearch
                ? "Oops! No tasks found matching your search."
                : "Start creating your first task! Click the 'Add' button to add a new task to your list. Let's get started!"
            }
          />
        )}
      </div>

      <button
        className="size-14 sm:size-16 flex items-center justify-center rounded-2xl bg-my-primary hover:bg-blue-600 fixed right-6 bottom-6 sm:right-10 sm:bottom-10 shadow-md"
        onClick={() =>
          setOpenAddEditModal({ isOpen: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isOpen}
        onRequestClose={() =>
          setOpenAddEditModal({ isOpen: false, type: "add", data: null })
        }
        contentLabel="Add Edit Notes Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            paddingInline: "16px",
          },
        }}
        className="max-w-xl max-h-[90%] bg-white rounded-lg p-5 mx-auto mt-14 overflow-auto outline-none"
      >
        <AddEditNotes
          noteData={openAddEditModal.data}
          getAllNotes={getAllNotes}
          type={openAddEditModal.type}
          onClose={() =>
            setOpenAddEditModal({ isOpen: false, type: "add", data: null })
          }
        />
      </Modal>
    </>
  );
}
