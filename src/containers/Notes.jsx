import {useState, useEffect, useRef} from "react";
import NoteList from "../components/NoteList";
import api from "../util/api"

const Notes = () => {
  const [notes, _setNotes] = useState([]);
  const [note, setNote] = useState(getNewNote(false));
  const [movingNote, _setMovingNote] = useState(null);

  const notesRef = useRef(notes);
  function setNotes(data) {
    notesRef.current = data;
    _setNotes(data);
  }
  const movingNoteRef = useRef(movingNote);
  function setMovingNote(data) {
    movingNoteRef.current = data;
    _setMovingNote(data);
  }

  useEffect(() => {
    api.get("")
      .then(({data}) => setNotes(data))

    document.addEventListener('mousedown', (event) => {
      moveItemStart(event)
    });

    document.addEventListener('mousemove', (event) => {
      moveItem(event);
    });

    document.addEventListener('mouseup', (event) => {
      moveItemEnd();
    });

    return () => {
      document.removeEventListener('mousedown', null);
      document.removeEventListener('mousemove', null);
      document.removeEventListener('mouseup', null);
    }
  }, []);

  function getNewNote(mode) {
    return {
      id: null,
      text: '',
      editMode: mode,
      position: {top: 20, left: 20}
    }
  }

  function handleNoteEditMode(id, mode) {
    setNotes(
      notes.map(item =>
        item.id === id ? {...item, editMode: mode} : item
      )
    );
  }

  function handleNoteChanges(updatedItem) {
    if (updatedItem.text.trim()) {
     saveNote(updatedItem);
    } else {
      if (updatedItem.id) {
        handleNoteEditMode(updatedItem.id, false);
      } else {
        setNote(getNewNote(false));
      }
    }
  }

  function saveNote(updatedItem) {
    if (updatedItem.id) {
      api.put(`/${updatedItem.id}`, updatedItem)
        .then(
          ({data}) => {
            setMovingNote(null);
            setNotes(
              notesRef.current.map(item =>
                item.id === updatedItem.id ? data : item
              )
            )
          }
        );
    } else {
      api.post("", updatedItem)
        .then(({data}) => {
          setNotes([...notes, data]);
          setNote(getNewNote(false));
        });
    }
  }

  function deleteNote(id) {
    api.delete(`/${id}`)
      .then(() => {
        setNotes(
          notes.filter(item => item.id !== id)
        )
      })
  }


  function moveItemStart(event) {
    if (event.target.id) {
      setMovingNote(event.target.id)
    }
    // blocks editing note
    // else if (event.target.closest('li')) {
    //   setMovingNote(event.target.closest('li').id)
    // }
  }

  function moveItem(event) {
    if (movingNoteRef.current) {
      const top = event.pageY - 70;
      const left = event.pageX - 20;
      setNotes(notesRef.current.map(item =>
          item.id === Number(movingNoteRef.current) ?
            { ...item, position: {top, left} } :
            item
        )
      )
    }
  }

  function moveItemEnd() {
    if (movingNoteRef.current) {
      const movingItem = notesRef.current
        .filter(item => item.id === Number(movingNoteRef.current))[0];
      if (movingItem.position.top > 0 && movingItem.position.left > 0) {
        saveNote(movingItem);
      }
    }
  }

  return(
    <div className="notes">
      <button
        className="add-button"
        type="button"
        onClick={() => setNote(getNewNote(true))}
      >
        New note
      </button>
      <NoteList
        items={notes}
        activeItem={note}
        onItemClick={handleNoteEditMode}
        onItemBlur={handleNoteChanges}
        onDeleteBtnClick={deleteNote}
      />
    </div>
  );
}

export default Notes;
